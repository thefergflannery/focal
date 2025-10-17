"use client";

import { signIn, getProviders } from "next-auth/react";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Chrome, BookOpen } from "lucide-react";

export default function SignInPage() {
  const [providers, setProviders] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
      setLoading(false);
    };
    fetchProviders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <BookOpen className="w-12 h-12 text-primary" />
              </div>
              <CardTitle className="text-2xl">
                Sign in to Focloireacht
              </CardTitle>
              <p className="text-muted-foreground">
                Join our community of Irish language enthusiasts
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {providers && (
                <>
                  {providers.google && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => signIn("google", { callbackUrl: "/" })}
                    >
                      <Chrome className="w-4 h-4 mr-2" />
                      Continue with Google
                    </Button>
                  )}

                  {/* Email provider temporarily disabled - can be re-enabled with custom Resend implementation */}
                </>
              )}

              <div className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy
                Policy.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
