"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signIn, signOut } from "next-auth/react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function DebugAuthPage() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Authentication Debug Page</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Session Status:</h3>
                <p className="text-sm text-muted-foreground">
                  {status === "loading" && "Loading..."}
                  {status === "authenticated" && "✅ Authenticated"}
                  {status === "unauthenticated" && "❌ Not authenticated"}
                </p>
              </div>

              {session && (
                <div>
                  <h3 className="font-semibold mb-2">User Information:</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="text-sm overflow-auto">
                      {JSON.stringify(session, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                {!session ? (
                  <Button onClick={() => signIn("google")}>
                    Test Google Sign-In
                  </Button>
                ) : (
                  <Button variant="outline" onClick={() => signOut()}>
                    Sign Out
                  </Button>
                )}
              </div>

              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Environment Variables Check:</strong>
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    NEXTAUTH_URL: {process.env.NEXTAUTH_URL || "❌ Not set"}
                  </li>
                  <li>
                    NEXTAUTH_SECRET:{" "}
                    {process.env.NEXTAUTH_SECRET ? "✅ Set" : "❌ Not set"}
                  </li>
                  <li>
                    GOOGLE_CLIENT_ID:{" "}
                    {process.env.GOOGLE_CLIENT_ID ? "✅ Set" : "❌ Not set"}
                  </li>
                  <li>
                    GOOGLE_CLIENT_SECRET:{" "}
                    {process.env.GOOGLE_CLIENT_SECRET ? "✅ Set" : "❌ Not set"}
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
