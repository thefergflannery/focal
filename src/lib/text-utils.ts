/**
 * Normalize text by removing diacritics and converting to lowercase
 * This helps with search functionality across different Irish language variations
 */
export function normalize(text: string): string {
  return text
    .normalize("NFD") // Decompose characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .toLowerCase()
    .trim();
}

/**
 * Create a slug from text for URL-friendly strings
 */
export function slugify(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Escape special characters for PostgreSQL full-text search
 */
export function escapeSearchText(text: string): string {
  return text
    .replace(/[&|!():'"]/g, "\\$&")
    .replace(/\s+/g, " ")
    .trim();
}
