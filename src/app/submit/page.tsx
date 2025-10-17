"use client";

// import { useState } from "react" // Not currently used
import { useSession } from "next-auth/react";
import { EnhancedSubmitForm } from "@/components/enhanced-submit-form";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Edit } from "lucide-react";
import Link from "next/link";

export default function SubmitPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-1/3 mb-4" />
              <div className="h-4 bg-muted rounded w-2/3 mb-8" />
              <div className="h-96 bg-muted rounded" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2">
                  <BookOpen className="w-6 h-6" />
                  <span>Sign in to Submit</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  You need to be signed in to submit new entries to our
                  dictionary.
                </p>
                <Button asChild>
                  <Link href="/api/auth/signin">Sign in</Link>
                </Button>
              </CardContent>
            </Card>
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
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Submit New Entry</h1>
            <p className="text-muted-foreground">
              Help us grow the Irish language dictionary by contributing new
              words, definitions, or variants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="text-center">
                <Plus className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">New Entry</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Submit a completely new word or phrase to the dictionary.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Edit className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Add Definition</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Add a new definition to an existing word entry.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <BookOpen className="w-8 h-8 mx-auto mb-2 text-primary" />
                <CardTitle className="text-lg">Add Variant</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-sm text-muted-foreground">
                  Add a regional variant or pronunciation to an existing word.
                </p>
              </CardContent>
            </Card>
          </div>

          <EnhancedSubmitForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
