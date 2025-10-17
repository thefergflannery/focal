import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { normalize } from "@/lib/text-utils";
import { WordPageClient } from "./word-page-client";

interface WordPageProps {
  params: {
    slug: string;
  };
}

async function getEntryBySlug(slug: string) {
  try {
    const entry = await prisma.entry.findFirst({
      where: {
        isActive: true,
        OR: [
          { headword: { equals: slug, mode: "insensitive" } },
          { normalized: normalize(slug) },
        ],
      },
      include: {
        definitions: {
          where: { isActive: true },
          orderBy: { popularity: "desc" },
          include: {
            _count: {
              select: {
                votes: true,
              },
            },
          },
        },
        variants: {
          where: { isActive: true },
          orderBy: { createdAt: "asc" },
        },
        regions: {
          include: {
            region: true,
          },
        },
        sources: {
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            definitions: true,
            variants: true,
          },
        },
      },
    });

    return entry;
  } catch (error) {
    console.error("Error fetching entry:", error);
    return null;
  }
}

async function getSimilarEntries(entryId: string) {
  try {
    const similar = await prisma.entry.findMany({
      where: {
        isActive: true,
        id: { not: entryId },
      },
      select: {
        id: true,
        headword: true,
        partOfSpeech: true,
        popularity: true,
        _count: {
          select: {
            definitions: true,
          },
        },
      },
      orderBy: { popularity: "desc" },
      take: 5,
    });

    return similar;
  } catch (error) {
    console.error("Error fetching similar entries:", error);
    return [];
  }
}

export default async function WordPage({ params }: WordPageProps) {
  const entry = await getEntryBySlug(params.slug);

  if (!entry) {
    notFound();
  }

  const similarEntries = await getSimilarEntries(entry.id);

  return <WordPageClient entry={entry} similarEntries={similarEntries} />;
}

export async function generateMetadata({ params }: WordPageProps) {
  const entry = await getEntryBySlug(params.slug);

  if (!entry) {
    return {
      title: "Entry Not Found",
    };
  }

  return {
    title: `${entry.headword} - Focloireacht`,
    description:
      entry.definitions[0]?.definition || `Irish word: ${entry.headword}`,
    openGraph: {
      title: `${entry.headword} - Focloireacht`,
      description:
        entry.definitions[0]?.definition || `Irish word: ${entry.headword}`,
      type: "website",
      images: [
        {
          url: `/og?headword=${encodeURIComponent(entry.headword)}&definition=${encodeURIComponent(entry.definitions[0]?.definition || "")}`,
          width: 1200,
          height: 630,
          alt: `${entry.headword} - Irish word definition`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.headword} - Focloireacht`,
      description:
        entry.definitions[0]?.definition || `Irish word: ${entry.headword}`,
      images: [
        `/og?headword=${encodeURIComponent(entry.headword)}&definition=${encodeURIComponent(entry.definitions[0]?.definition || "")}`,
      ],
    },
  };
}
