import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";
import { MapPin, Book } from "lucide-react";

async function getRegions() {
  try {
    // Check if we have a database connection
    await prisma.$connect();

    const regions = await prisma.region.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            entries: true,
          },
        },
      },
      orderBy: { name: "asc" },
      take: 6,
    });

    return regions;
  } catch (error) {
    // During build time or when database is not available, return empty array
    console.error("Error fetching regions:", error);
    return [];
  }
}

export async function RegionsList() {
  const regions = await getRegions();

  if (regions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Regions Coming Soon</h3>
          <p className="text-muted-foreground mb-4">
            We're organizing Irish language entries by regional dialects and
            Gaeltacht areas.
          </p>
          <p className="text-sm text-muted-foreground">
            This will help you explore words specific to different regions of
            Ireland.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {regions.map(region => (
        <Card key={region.id} className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-xl font-bold">
                <Link
                  href={`/regions/${region.slug}`}
                  className="hover:text-primary transition-colors flex items-center space-x-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span>{region.name}</span>
                </Link>
              </CardTitle>
            </div>

            {region.country && (
              <Badge variant="outline" className="w-fit">
                {region.country}
              </Badge>
            )}
          </CardHeader>

          <CardContent>
            {region.description && (
              <p className="text-muted-foreground mb-3 line-clamp-2">
                {region.description}
              </p>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Book className="w-4 h-4" />
                <span>{region._count.entries} entries</span>
              </div>

              {region.county && (
                <Badge variant="secondary" className="text-xs">
                  {region.county}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
