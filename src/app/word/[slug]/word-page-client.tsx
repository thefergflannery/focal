"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VoteButtons } from "@/components/vote-buttons";
import {
  Volume2,
  MapPin,
  BookOpen,
  ExternalLink,
  ThumbsUp,
} from "lucide-react";

interface Definition {
  id: string;
  definition: string;
  example: string | null;
  notes: string | null;
  popularity: number;
  _count: {
    votes: number;
  };
}

interface Variant {
  id: string;
  variant: string;
  pronunciation: string | null;
  notes: string | null;
}

interface Region {
  id: string;
  name: string;
  slug: string;
  country: string | null;
  county: string | null;
}

interface Source {
  id: string;
  title: string;
  author: string | null;
  publisher: string | null;
  year: number | null;
  url: string | null;
  isbn: string | null;
}

interface Entry {
  id: string;
  headword: string;
  partOfSpeech: string | null;
  etymology: string | null;
  notes: string | null;
  audioUrl: string | null;
  popularity: number;
  definitions: Definition[];
  variants: Variant[];
  regions: Array<{
    id: string;
    region: Region;
  }>;
  sources: Source[];
  _count: {
    definitions: number;
    variants: number;
  };
}

interface SimilarEntry {
  id: string;
  headword: string;
  partOfSpeech: string | null;
  popularity: number;
  _count: {
    definitions: number;
  };
}

interface WordPageClientProps {
  entry: Entry;
  similarEntries: SimilarEntry[];
}

export function WordPageClient({ entry, similarEntries }: WordPageClientProps) {
  const { data: session } = useSession();
  const [playingAudio, setPlayingAudio] = useState(false);

  const playAudio = async () => {
    if (!entry.audioUrl) return;

    setPlayingAudio(true);
    try {
      const audio = new Audio(entry.audioUrl);
      await audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    } finally {
      setPlayingAudio(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">{entry.headword}</h1>
            {entry.partOfSpeech && (
              <Badge variant="outline" className="text-sm">
                {entry.partOfSpeech}
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {entry.audioUrl && (
              <Button
                variant="outline"
                size="sm"
                onClick={playAudio}
                disabled={playingAudio}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {playingAudio ? "Playing..." : "Listen"}
              </Button>
            )}
            <Badge variant="secondary" className="flex items-center space-x-1">
              <ThumbsUp className="w-3 h-3" />
              <span>{entry.popularity}</span>
            </Badge>
          </div>
        </div>

        {entry.etymology && (
          <div className="bg-muted/50 p-4 rounded-lg mb-4">
            <h3 className="font-semibold mb-2">Etymology</h3>
            <p className="text-sm text-muted-foreground">{entry.etymology}</p>
          </div>
        )}

        {entry.notes && (
          <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Notes</h3>
            <p className="text-sm">{entry.notes}</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <Tabs defaultValue="definitions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="definitions">
            Definitions ({entry.definitions.length})
          </TabsTrigger>
          <TabsTrigger value="variants">
            Variants ({entry.variants.length})
          </TabsTrigger>
          <TabsTrigger value="context">Context & Sources</TabsTrigger>
        </TabsList>

        <TabsContent value="definitions" className="space-y-4">
          {entry.definitions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No definitions available yet.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Help us by adding a definition!
                </p>
              </CardContent>
            </Card>
          ) : (
            entry.definitions.map((definition, index) => (
              <Card key={definition.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">
                        {index + 1}. {definition.definition}
                      </h3>
                      {definition.example && (
                        <p className="text-muted-foreground italic mb-2">
                          Example: {definition.example}
                        </p>
                      )}
                      {definition.notes && (
                        <p className="text-sm text-muted-foreground">
                          {definition.notes}
                        </p>
                      )}
                    </div>

                    {session && (
                      <VoteButtons
                        definitionId={definition.id}
                        initialVotes={definition._count.votes}
                        initialPopularity={definition.popularity}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="variants" className="space-y-4">
          {entry.variants.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  No variants available yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            entry.variants.map(variant => (
              <Card key={variant.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {variant.variant}
                      </h3>
                      {variant.pronunciation && (
                        <p className="text-muted-foreground text-sm">
                          /{variant.pronunciation}/
                        </p>
                      )}
                      {variant.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {variant.notes}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="context" className="space-y-6">
          {/* Regions */}
          {entry.regions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>Regions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {entry.regions.map(entryRegion => (
                    <Link
                      key={entryRegion.id}
                      href={`/regions/${entryRegion.region.slug}`}
                    >
                      <Badge
                        variant="secondary"
                        className="hover:bg-secondary/80 transition-colors"
                      >
                        {entryRegion.region.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Sources */}
          {entry.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Sources</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {entry.sources.map(source => (
                  <div
                    key={source.id}
                    className="border-l-4 border-primary/20 pl-4"
                  >
                    <h4 className="font-semibold">{source.title}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {source.author && <p>Author: {source.author}</p>}
                      {source.publisher && <p>Publisher: {source.publisher}</p>}
                      {source.year && <p>Year: {source.year}</p>}
                      {source.isbn && <p>ISBN: {source.isbn}</p>}
                    </div>
                    {source.url && (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-sm text-primary hover:underline mt-2"
                      >
                        <span>View Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Similar Entries */}
      {similarEntries.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Entries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarEntries.map(similar => (
              <Link
                key={similar.id}
                href={`/word/${encodeURIComponent(similar.headword)}`}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <h3 className="font-semibold">{similar.headword}</h3>
                    {similar.partOfSpeech && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {similar.partOfSpeech}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">
                      {similar._count.definitions} definition
                      {similar._count.definitions !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
