import { SearchBar } from "@/components/search-bar";
import { RecentEntries } from "@/components/recent-entries";
import { TopWords } from "@/components/top-words";
import { RegionsList } from "@/components/regions-list";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Focloireacht
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover and explore the rich vocabulary of Irish language through
            our comprehensive dictionary. Search, contribute, and learn
            together.
          </p>

          <div className="max-w-2xl mx-auto">
            <SearchBar />
          </div>
        </section>

        {/* Recent Entries */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Recently Added
          </h2>
          <RecentEntries />
        </section>

        {/* Top Words */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Top 10 Popular Words
          </h2>
          <TopWords />
        </section>

        {/* Regions */}
        <section className="py-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explore by Region
          </h2>
          <RegionsList />
        </section>
      </main>

      <Footer />
    </div>
  );
}
