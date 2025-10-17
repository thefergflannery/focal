import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { RegionsList } from "@/components/regions-list";

export default function RegionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Irish Language Regions</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore Irish words and phrases organized by their regional usage
            and origins. Each region represents a unique dialect and cultural
            heritage of the Irish language.
          </p>
        </div>

        <RegionsList />
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Regions - Focloireacht",
  description: "Explore Irish language entries by region and dialect",
};
