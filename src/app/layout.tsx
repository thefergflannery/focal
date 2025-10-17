import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/session-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Focloireacht - Irish Language Dictionary",
  description:
    "A comprehensive Irish language dictionary built by and for the community. Search, contribute, and learn together.",
  keywords: ["Irish", "Gaeilge", "dictionary", "language", "Ireland", "Celtic"],
  authors: [{ name: "Focloireacht Team" }],
  openGraph: {
    title: "Focloireacht - Irish Language Dictionary",
    description:
      "A comprehensive Irish language dictionary built by and for the community.",
    type: "website",
    locale: "en_IE",
  },
  twitter: {
    card: "summary_large_image",
    title: "Focloireacht - Irish Language Dictionary",
    description:
      "A comprehensive Irish language dictionary built by and for the community.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
