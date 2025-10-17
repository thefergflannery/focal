import { prisma } from "@/lib/db";
import { normalize, escapeSearchText } from "@/lib/text-utils";

export interface SearchResult {
  id: string;
  headword: string;
  partOfSpeech?: string | null;
  definition?: string;
  region?: string;
  popularity: number;
  type: "entry" | "definition" | "variant";
}

export async function searchEntries(
  query: string,
  limit: number = 20,
  offset: number = 0
): Promise<SearchResult[]> {
  const normalizedQuery = normalize(query);
  const escapedQuery = escapeSearchText(query);

  // Full-text search across entries and definitions
  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT DISTINCT ON (e.id)
      e.id,
      e.headword,
      e."partOfSpeech",
      d.definition,
      r.name as region,
      e.popularity,
      'entry' as type
    FROM entries e
    LEFT JOIN definitions d ON e.id = d."entryId" AND d."isActive" = true
    LEFT JOIN "entry_regions" er ON e.id = er."entryId"
    LEFT JOIN regions r ON er."regionId" = r.id AND r."isActive" = true
    WHERE 
      e."isActive" = true AND (
        e.normalized ILIKE ${`%${normalizedQuery}%`} OR
        e.headword ILIKE ${`%${query}%`} OR
        to_tsvector('english', e.headword) @@ plainto_tsquery('english', ${escapedQuery}) OR
        (d.definition IS NOT NULL AND to_tsvector('english', d.definition) @@ plainto_tsquery('english', ${escapedQuery}))
      )
    ORDER BY e.id, e.popularity DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  // Also search variants
  const variantResults = await prisma.$queryRaw<SearchResult[]>`
    SELECT DISTINCT ON (e.id)
      e.id,
      e.headword,
      e."partOfSpeech",
      v.variant as definition,
      r.name as region,
      e.popularity,
      'variant' as type
    FROM entries e
    JOIN variants v ON e.id = v."entryId"
    LEFT JOIN "entry_regions" er ON e.id = er."entryId"
    LEFT JOIN regions r ON er."regionId" = r.id AND r."isActive" = true
    WHERE 
      e."isActive" = true AND v."isActive" = true AND (
        v.normalized ILIKE ${`%${normalizedQuery}%`} OR
        v.variant ILIKE ${`%${query}%`}
      )
    ORDER BY e.id, e.popularity DESC
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  // Combine and deduplicate results
  const combinedResults = [...results, ...variantResults];
  const uniqueResults = combinedResults.reduce((acc, current) => {
    const existing = acc.find(item => item.id === current.id);
    if (!existing || current.popularity > existing.popularity) {
      return acc.filter(item => item.id !== current.id).concat(current);
    }
    return acc;
  }, [] as SearchResult[]);

  return uniqueResults.sort((a, b) => b.popularity - a.popularity);
}

export async function searchSimilarEntries(
  entryId: string,
  limit: number = 10
): Promise<SearchResult[]> {
  const entry = await prisma.entry.findUnique({
    where: { id: entryId },
    select: { normalized: true, headword: true },
  });

  if (!entry) return [];

  // Use trigram similarity for fuzzy matching
  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT 
      e.id,
      e.headword,
      e."partOfSpeech",
      NULL as definition,
      NULL as region,
      e.popularity,
      'entry' as type,
      similarity(e.normalized, ${entry.normalized}) as sim
    FROM entries e
    WHERE 
      e.id != ${entryId} AND 
      e."isActive" = true AND
      similarity(e.normalized, ${entry.normalized}) > 0.3
    ORDER BY sim DESC, e.popularity DESC
    LIMIT ${limit}
  `;

  return results;
}
