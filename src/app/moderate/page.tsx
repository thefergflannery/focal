import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ModerationDashboard } from "@/components/moderation-dashboard";
import { ModerationStats } from "@/components/moderation-stats";

export default function ModeratePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Statistics Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Moderation Overview</h2>
            <ModerationStats />
          </div>

          {/* Main Dashboard */}
          <ModerationDashboard />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const metadata = {
  title: "Moderation Dashboard - Focloireacht",
  description:
    "Review and moderate community submissions, reports, and suggestions",
};
