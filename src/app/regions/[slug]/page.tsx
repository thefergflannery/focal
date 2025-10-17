import { notFound } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { MapPin, Book, TrendingUp } from "lucide-react";

interface RegionPageProps {
  params: {
    slug: string;
  };
}

async function getRegionBySlug(slug: string) {
  try {
    const region = await prisma.region.findUnique({
      where: { slug, isActive: true },
      include: {
        entries: {
          include: {
            entry: {
              include: {
                definitions: {
                  where: { isActive: true },
                  orderBy: { popularity: "desc" },
                  take: 1,
                },
                _count: {
                  select: {
                    definitions: true,
                    variants: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: {
          select: {
            entries: true,
          },
        },
      },
    });

    return region;
  } catch (error) {
    console.error("Error fetching region:", error);
    return null;
  }
}

export default async function RegionPage({ params }: RegionPageProps) {
  const region = await getRegionBySlug(params.slug);

  if (!region) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Region Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center space-x-2">
                <MapPin className="w-8 h-8 text-primary" />
                <span>{region.name}</span>
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                {region.country && (
                  <Badge variant="outline">{region.country}</Badge>
                )}
                {region.county && (
                  <Badge variant="secondary">{region.county}</Badge>
                )}
                <Badge
                  variant="default"
                  className="flex items-center space-x-1"
                >
                  <Book className="w-3 h-3" />
                  <span>{region._count.entries} entries</span>
                </Badge>
              </div>
            </div>
          </div>

          {region.description && (
            <div className="bg-muted/50 p-6 rounded-lg">
              <p className="text-lg text-muted-foreground">
                {region.description}
              </p>
            </div>
          )}
        </div>

        {/* Entries */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Recent Entries</h2>

          {region.entries.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No entries have been added to this region yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Help us by submitting entries for this region!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {region.entries.map(entryRegion => {
                const entry = entryRegion.entry;
                return (
                  <Card
                    key={entry.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-xl">
                        <Link
                          href={`/word/${encodeURIComponent(entry.headword)}`}
                          className="hover:text-primary transition-colors"
                        >
                          {entry.headword}
                        </Link>
                      </CardTitle>

                      {entry.partOfSpeech && (
                        <Badge variant="outline" className="w-fit">
                          {entry.partOfSpeech}
                        </Badge>
                      )}
                    </CardHeader>

                    <CardContent>
                      {entry.definitions[0] && (
                        <p className="text-muted-foreground mb-3 line-clamp-2">
                          {entry.definitions[0].definition}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <span>
                            {entry._count.definitions} definition
                            {entry._count.definitions !== 1 ? "s" : ""}
                          </span>
                          <span>
                            {entry._count.variants} variant
                            {entry._count.variants !== 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{entry.popularity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export async function generateMetadata({ params }: RegionPageProps) {
  const region = await getRegionBySlug(params.slug);

  if (!region) {
    return {
      title: "Region Not Found",
    };
  }

  return {
    title: `${region.name} - Focloireacht`,
    description:
      region.description || `Irish language entries from ${region.name}`,
    openGraph: {
      title: `${region.name} - Focloireacht`,
      description:
        region.description || `Irish language entries from ${region.name}`,
      type: "website",
    },
  };
}
