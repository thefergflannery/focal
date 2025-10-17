"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, LogOut, BookOpen } from "lucide-react";

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Focloireacht</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dictionary"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Dictionary
            </Link>
            <Link
              href="/regions"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Regions
            </Link>
            <Link
              href="/top-words"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Top Words
            </Link>
            <Link
              href="/submit"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Submit
            </Link>
            {session?.user?.role === "EDITOR" ||
            session?.user?.role === "ADMIN" ? (
              <>
                <Link
                  href="/queue"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Queue
                </Link>
                <Link
                  href="/moderate"
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Moderate
                </Link>
              </>
            ) : null}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div className="hidden sm:block text-sm">
                    <div className="font-medium">{session.user.name}</div>
                    <div className="flex items-center space-x-1">
                      <Badge variant="secondary" className="text-xs">
                        {session.user.role}
                      </Badge>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut()}
                  className="hidden sm:flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => signIn()}>
                  Sign in
                </Button>
                <Button size="sm" onClick={() => signIn()}>
                  Get started
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
