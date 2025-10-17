import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { TopWords } from "@/components/top-words";

export default function TopWordsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">
            Top 10 Popular Irish Words
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the most popular Irish words based on community votes and
            usage. These are the words that resonate most with our Irish
            language community.
          </p>
        </div>

        <TopWords />
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Top Words - Focloireacht",
  description:
    "Discover the most popular Irish words based on community votes and usage",
};
