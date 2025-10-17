import { Suspense } from "react";
import { SearchResults } from "@/components/search-results";
import { SearchBar } from "@/components/search-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

interface SearchPageProps {
  searchParams: {
    q?: string;
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || "";

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {query && (
          <Suspense fallback={<SearchResultsSkeleton />}>
            <SearchResults query={query} />
          </Suspense>
        )}

        {!query && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Search Irish Words</h2>
            <p className="text-muted-foreground">
              Enter a word, phrase, or definition to search our dictionary.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

function SearchResultsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border rounded-lg p-6">
          <div className="h-6 bg-muted rounded w-1/4 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-3/4 mb-2 animate-pulse" />
          <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
