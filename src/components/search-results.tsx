import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchEntries } from "@/lib/search";
import { TrendingUp, MapPin } from "lucide-react";

interface SearchResultsProps {
  query: string;
}

export async function SearchResults({ query }: SearchResultsProps) {
  const results = await searchEntries(query, 20, 0);

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-muted-foreground">
          Try searching for a different word or check your spelling.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {results.length} result{results.length !== 1 ? "s" : ""} for &quot;
          {query}&quot;
        </h2>
      </div>

      <div className="grid gap-4">
        {results.map(result => (
          <Card
            key={`${result.id}-${result.type}`}
            className="hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">
                    <Link
                      href={`/word/${encodeURIComponent(result.headword)}`}
                      className="hover:text-primary transition-colors"
                    >
                      {result.headword}
                    </Link>
                  </h3>

                  {result.partOfSpeech && (
                    <Badge variant="outline" className="mb-3">
                      {result.partOfSpeech}
                    </Badge>
                  )}

                  {result.definition && (
                    <p className="text-muted-foreground mb-3 line-clamp-2">
                      {result.definition}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{result.popularity}</span>
                    </div>

                    {result.region && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{result.region}</span>
                      </div>
                    )}

                    <Badge variant="secondary" className="text-xs">
                      {result.type}
                    </Badge>
                  </div>
                </div>

                <div className="ml-4 flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {result.type}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
