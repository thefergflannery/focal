import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DictionaryView } from "@/components/dictionary-view";

export default function DictionaryPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <DictionaryView />
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Dictionary - Focloireacht",
  description:
    "Browse Irish words alphabetically in our comprehensive dictionary",
};
