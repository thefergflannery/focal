import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { Clock, Users, MapPin, TrendingUp } from "lucide-react";

async function getRecentEntries() {
  try {
    // Check if we have a database connection
    await prisma.$connect();

    const entries = await prisma.entry.findMany({
      where: { isActive: true },
      include: {
        definitions: {
          where: { isActive: true },
          orderBy: { popularity: "desc" },
          take: 1,
        },
        regions: {
          include: {
            region: true,
          },
        },
        _count: {
          select: {
            definitions: true,
            variants: true,
            entryVotes: true,
          },
        },
      },
      orderBy: { createdAt: "desc" }, // Changed from popularity to createdAt
      take: 6,
    });

    return entries;
  } catch (error) {
    console.error("Error fetching recent entries:", error);
    return [];
  }
}

export async function RecentEntries() {
  const entries = await getRecentEntries();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Recent Entries</h3>
          <p className="text-muted-foreground mb-4">
            Newly added Irish words and phrases will appear here as the
            community grows.
          </p>
          <p className="text-sm text-muted-foreground">
            Be the first to contribute by submitting new words!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {entries.map(entry => (
        <Card key={entry.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl font-bold">
                <Link
                  href={`/word/${encodeURIComponent(entry.headword)}`}
                  className="hover:text-primary transition-colors"
                >
                  {entry.headword}
                </Link>
              </CardTitle>
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{new Date(entry.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {entry.partOfSpeech && (
                <Badge variant="outline" className="w-fit">
                  {entry.partOfSpeech}
                </Badge>
              )}

              <Badge
                variant={
                  entry.usageStatus === "CURRENT" ? "default" : "secondary"
                }
                className="text-xs flex items-center space-x-1"
              >
                {entry.usageStatus === "CURRENT" && (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Current</span>
                  </>
                )}
                {entry.usageStatus === "ARCHAIC" && (
                  <>
                    <Clock className="w-3 h-3" />
                    <span>Archaic</span>
                  </>
                )}
                {entry.usageStatus === "REGIONAL" && (
                  <>
                    <MapPin className="w-3 h-3" />
                    <span>Regional</span>
                  </>
                )}
                {entry.usageStatus === "RARE" && (
                  <>
                    <Users className="w-3 h-3" />
                    <span>Rare</span>
                  </>
                )}
              </Badge>
            </div>
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
                <span>{entry._count.entryVotes}</span>
              </div>
            </div>

            {entry.regions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {entry.regions.slice(0, 2).map(entryRegion => (
                    <Badge
                      key={entryRegion.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {entryRegion.region.name}
                    </Badge>
                  ))}
                  {entry.regions.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{entry.regions.length - 2} more
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
