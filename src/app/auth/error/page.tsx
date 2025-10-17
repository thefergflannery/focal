"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

const errorMessages: Record<string, string> = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") || "Default";
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 text-center">
              <p className="text-muted-foreground">{message}</p>

              <div className="flex flex-col space-y-2">
                <Button asChild>
                  <Link
                    href="/auth/signin"
                    className="flex items-center space-x-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Try Again</span>
                  </Link>
                </Button>

                <Button variant="outline" asChild>
                  <Link href="/" className="flex items-center space-x-2">
                    <Home className="w-4 h-4" />
                    <span>Go Home</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
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
      }
    >
      <AuthErrorContent />
    </Suspense>
  );
}
