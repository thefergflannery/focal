"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  BookOpen,
  Filter,
  Users,
  MapPin,
  Clock,
  TrendingUp,
} from "lucide-react";

// Mock data - in real app, this would come from API
const mockDictionaryEntries = {
  A: [
    {
      id: "1",
      headword: "agus",
      partOfSpeech: "conjunction",
      definition: "and",
      popularity: 95,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal"],
    },
    {
      id: "2",
      headword: "am",
      partOfSpeech: "noun",
      definition: "time",
      popularity: 87,
      usageStatus: "CURRENT",
      regions: ["connemara", "cork"],
    },
    {
      id: "3",
      headword: "áit",
      partOfSpeech: "noun",
      definition: "place",
      popularity: 82,
      usageStatus: "CURRENT",
      regions: ["donegal", "kerry"],
    },
  ],
  B: [
    {
      id: "4",
      headword: "bád",
      partOfSpeech: "noun",
      definition: "boat",
      popularity: 78,
      usageStatus: "CURRENT",
      regions: ["connemara", "waterford"],
    },
    {
      id: "5",
      headword: "bean",
      partOfSpeech: "noun",
      definition: "woman",
      popularity: 91,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal", "cork"],
    },
    {
      id: "6",
      headword: "beag",
      partOfSpeech: "adjective",
      definition: "small",
      popularity: 85,
      usageStatus: "CURRENT",
      regions: ["connemara", "kerry"],
    },
  ],
  C: [
    {
      id: "7",
      headword: "cara",
      partOfSpeech: "noun",
      definition: "friend",
      popularity: 89,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal"],
    },
    {
      id: "8",
      headword: "cathair",
      partOfSpeech: "noun",
      definition: "city",
      popularity: 76,
      usageStatus: "CURRENT",
      regions: ["connemara", "cork"],
    },
    {
      id: "9",
      headword: "ceol",
      partOfSpeech: "noun",
      definition: "music",
      popularity: 88,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal", "kerry"],
    },
  ],
  D: [
    {
      id: "10",
      headword: "doras",
      partOfSpeech: "noun",
      definition: "door",
      popularity: 83,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal"],
    },
    {
      id: "11",
      headword: "duine",
      partOfSpeech: "noun",
      definition: "person",
      popularity: 92,
      usageStatus: "CURRENT",
      regions: ["connemara", "cork", "kerry"],
    },
  ],
  E: [
    {
      id: "12",
      headword: "éan",
      partOfSpeech: "noun",
      definition: "bird",
      popularity: 79,
      usageStatus: "CURRENT",
      regions: ["connemara", "donegal"],
    },
  ],
  // Add more letters as needed...
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const regions = [
  { id: "all", name: "All Regions" },
  { id: "connemara", name: "Connemara" },
  { id: "donegal", name: "Donegal" },
  { id: "cork", name: "Cork" },
  { id: "kerry", name: "Kerry" },
  { id: "waterford", name: "Waterford" },
  { id: "meath", name: "Meath" },
];

export function DictionaryView() {
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [filteredEntries, setFilteredEntries] = useState(
    mockDictionaryEntries.A
  );

  useEffect(() => {
    let entries =
      mockDictionaryEntries[
        selectedLetter as keyof typeof mockDictionaryEntries
      ] || [];

    // Filter by search term
    if (searchTerm) {
      entries = entries.filter(
        entry =>
          entry.headword.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.definition.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by region
    if (selectedRegion !== "all") {
      entries = entries.filter(entry => entry.regions.includes(selectedRegion));
    }

    setFilteredEntries(entries);
  }, [selectedLetter, searchTerm, selectedRegion]);

  const getUsageStatusIcon = (status: string) => {
    switch (status) {
      case "CURRENT":
        return <Users className="w-3 h-3" />;
      case "ARCHAIC":
        return <Clock className="w-3 h-3" />;
      case "REGIONAL":
        return <MapPin className="w-3 h-3" />;
      case "RARE":
        return <Users className="w-3 h-3" />;
      default:
        return <Users className="w-3 h-3" />;
    }
  };

  const getUsageStatusLabel = (status: string) => {
    switch (status) {
      case "CURRENT":
        return "Current";
      case "ARCHAIC":
        return "Archaic";
      case "REGIONAL":
        return "Regional";
      case "RARE":
        return "Rare";
      default:
        return "Current";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold flex items-center justify-center space-x-2">
          <BookOpen className="w-8 h-8" />
          <span>Irish-English Dictionary</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Browse Irish words alphabetically. Click on any word to see detailed
          definitions, regional variants, and pronunciation guides.
        </p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Words</label>
              <Input
                placeholder="Search Irish or English..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Region</label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Results</label>
              <div className="flex items-center h-10 px-3 border rounded-md bg-muted">
                <span className="text-sm text-muted-foreground">
                  {filteredEntries.length} word
                  {filteredEntries.length !== 1 ? "s" : ""} found
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alphabet Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Browse by Letter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {alphabet.map(letter => (
              <Button
                key={letter}
                variant={selectedLetter === letter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLetter(letter)}
                className="min-w-[2.5rem]"
              >
                {letter}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Dictionary Entries */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {selectedLetter} - {filteredEntries.length} words
          </h2>
          {filteredEntries.length === 0 && (
            <p className="text-muted-foreground">
              No words found for this letter and filter combination.
            </p>
          )}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEntries.map(entry => (
              <Card
                key={entry.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-bold">
                      <Link
                        href={`/word/${encodeURIComponent(entry.headword)}`}
                        className="hover:text-primary transition-colors"
                      >
                        {entry.headword}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      <span>{entry.popularity}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {entry.partOfSpeech}
                    </Badge>
                    <Badge
                      variant={
                        entry.usageStatus === "CURRENT"
                          ? "default"
                          : "secondary"
                      }
                      className="text-xs flex items-center space-x-1"
                    >
                      {getUsageStatusIcon(entry.usageStatus)}
                      <span>{getUsageStatusLabel(entry.usageStatus)}</span>
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-muted-foreground mb-3 line-clamp-2">
                    {entry.definition}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {entry.regions.map(regionId => {
                      const region = regions.find(r => r.id === regionId);
                      return region ? (
                        <Badge
                          key={regionId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {region.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Words Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search terms or filters to find more words.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
