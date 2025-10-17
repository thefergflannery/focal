import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { TrendingUp, Users, MapPin, Clock } from "lucide-react";

async function getTopWords(limit: number = 10) {
  try {
    // Check if we have a database connection
    await prisma.$connect();

    const entries = await prisma.entry.findMany({
      where: { isActive: true },
      include: {
        definitions: {
          where: { isActive: true },
          take: 1,
        },
        regions: {
          include: {
            region: true,
          },
        },
        _count: {
          select: {
            entryVotes: true,
            definitions: true,
            variants: true,
          },
        },
      },
      orderBy: { popularity: "desc" },
      take: limit,
    });

    return entries;
  } catch (error) {
    console.error("Error fetching top words:", error);
    return [];
  }
}

export async function TopWords() {
  const entries = await getTopWords();

  if (entries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Top Words Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            Popular Irish words will appear here based on community votes and
            usage.
          </p>
          <p className="text-sm text-muted-foreground">
            Start voting on words to see them rise to the top!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <Card key={entry.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center justify-center w-6 h-6 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <CardTitle className="text-xl font-bold">
                    <Link
                      href={`/word/${encodeURIComponent(entry.headword)}`}
                      className="hover:text-primary transition-colors"
                    >
                      {entry.headword}
                    </Link>
                  </CardTitle>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                    <span>{entry.popularity} votes</span>
                  </div>

                  {entry.partOfSpeech && (
                    <Badge variant="outline" className="text-xs">
                      {entry.partOfSpeech}
                    </Badge>
                  )}

                  <Badge
                    variant={
                      entry.usageStatus === "CURRENT" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {entry.usageStatus === "CURRENT" && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Current</span>
                      </div>
                    )}
                    {entry.usageStatus === "ARCHAIC" && (
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Archaic</span>
                      </div>
                    )}
                    {entry.usageStatus === "REGIONAL" && (
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>Regional</span>
                      </div>
                    )}
                    {entry.usageStatus === "RARE" && (
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>Rare</span>
                      </div>
                    )}
                  </Badge>
                </div>
              </div>
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
                <span>
                  {entry._count.entryVotes} vote
                  {entry._count.entryVotes !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {entry.regions.length > 0 && (
              <div className="mt-3 pt-3 border-t">
                <div className="flex flex-wrap gap-1">
                  {entry.regions.slice(0, 3).map(entryRegion => (
                    <Badge
                      key={entryRegion.id}
                      variant="secondary"
                      className="text-xs"
                    >
                      {entryRegion.region.name}
                    </Badge>
                  ))}
                  {entry.regions.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{entry.regions.length - 3} more
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
