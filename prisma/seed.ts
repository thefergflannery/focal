import { PrismaClient } from "@prisma/client";
import { normalize } from "../src/lib/text-utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Create regions
  const regions = await Promise.all([
    prisma.region.upsert({
      where: { slug: "connemara" },
      update: {},
      create: {
        name: "Connemara",
        slug: "connemara",
        description:
          "A region in County Galway, known for its strong Irish language tradition.",
        country: "Ireland",
        county: "Galway",
      },
    }),
    prisma.region.upsert({
      where: { slug: "corca-dhuibhne" },
      update: {},
      create: {
        name: "Corca Dhuibhne",
        slug: "corca-dhuibhne",
        description:
          "The Dingle Peninsula in County Kerry, a Gaeltacht region.",
        country: "Ireland",
        county: "Kerry",
      },
    }),
    prisma.region.upsert({
      where: { slug: "donegal" },
      update: {},
      create: {
        name: "Donegal",
        slug: "donegal",
        description: "County Donegal Gaeltacht regions.",
        country: "Ireland",
        county: "Donegal",
      },
    }),
    prisma.region.upsert({
      where: { slug: "mayo" },
      update: {},
      create: {
        name: "Mayo",
        slug: "mayo",
        description: "County Mayo Gaeltacht regions.",
        country: "Ireland",
        county: "Mayo",
      },
    }),
    prisma.region.upsert({
      where: { slug: "waterford" },
      update: {},
      create: {
        name: "Waterford",
        slug: "waterford",
        description: "County Waterford Gaeltacht regions.",
        country: "Ireland",
        county: "Waterford",
      },
    }),
    prisma.region.upsert({
      where: { slug: "cork" },
      update: {},
      create: {
        name: "Cork",
        slug: "cork",
        description: "County Cork Gaeltacht regions.",
        country: "Ireland",
        county: "Cork",
      },
    }),
  ]);

  console.log(`✅ Created ${regions.length} regions`);

  // Create sample entries
  const entries = await Promise.all([
    prisma.entry.upsert({
      where: {
        headword_partOfSpeech: {
          headword: "sláinte",
          partOfSpeech: "noun",
        },
      },
      update: {},
      create: {
        headword: "sláinte",
        normalized: normalize("sláinte"),
        partOfSpeech: "noun",
        etymology: "From Old Irish sláinte, from Proto-Celtic *slāntiyā.",
        notes: 'Commonly used as a toast meaning "health" or "cheers".',
        popularity: 100,
      },
    }),
    prisma.entry.upsert({
      where: {
        headword_partOfSpeech: {
          headword: "craic",
          partOfSpeech: "noun",
        },
      },
      update: {},
      create: {
        headword: "craic",
        normalized: normalize("craic"),
        partOfSpeech: "noun",
        etymology: "From Irish craic, from English crack.",
        notes: "Used to describe fun, entertainment, or good times.",
        popularity: 85,
      },
    }),
    prisma.entry.upsert({
      where: {
        headword_partOfSpeech: {
          headword: "céad míle fáilte",
          partOfSpeech: "phrase",
        },
      },
      update: {},
      create: {
        headword: "céad míle fáilte",
        normalized: normalize("céad míle fáilte"),
        partOfSpeech: "phrase",
        etymology: 'Literally "a hundred thousand welcomes".',
        notes: "A traditional Irish greeting expressing hospitality.",
        popularity: 75,
      },
    }),
    prisma.entry.upsert({
      where: {
        headword_partOfSpeech: {
          headword: "go raibh maith agat",
          partOfSpeech: "phrase",
        },
      },
      update: {},
      create: {
        headword: "go raibh maith agat",
        normalized: normalize("go raibh maith agat"),
        partOfSpeech: "phrase",
        etymology: 'Literally "may good be at you".',
        notes: 'Standard way to say "thank you" in Irish.',
        popularity: 90,
      },
    }),
    prisma.entry.upsert({
      where: {
        headword_partOfSpeech: {
          headword: "tá sé go maith",
          partOfSpeech: "phrase",
        },
      },
      update: {},
      create: {
        headword: "tá sé go maith",
        normalized: normalize("tá sé go maith"),
        partOfSpeech: "phrase",
        etymology: 'Literally "it is good".',
        notes: 'Common phrase meaning "it\'s good" or "that\'s good".',
        popularity: 70,
      },
    }),
  ]);

  console.log(`✅ Created ${entries.length} entries`);

  // Create definitions
  const definitions = await Promise.all([
    prisma.definition.upsert({
      where: {
        id: "slainte-def-1",
      },
      update: {},
      create: {
        id: "slainte-def-1",
        entryId: entries[0].id,
        definition: 'Health; used as a toast meaning "cheers" or "good health"',
        example: "Sláinte! (Cheers!)",
        popularity: 95,
      },
    }),
    prisma.definition.upsert({
      where: {
        id: "craic-def-1",
      },
      update: {},
      create: {
        id: "craic-def-1",
        entryId: entries[1].id,
        definition: "Fun, entertainment, good times, or enjoyable conversation",
        example: "Bhí craic ar fad ann! (There was great craic there!)",
        popularity: 80,
      },
    }),
    prisma.definition.upsert({
      where: {
        id: "cead-mile-failte-def-1",
      },
      update: {},
      create: {
        id: "cead-mile-failte-def-1",
        entryId: entries[2].id,
        definition:
          "A hundred thousand welcomes; a traditional Irish greeting expressing warm hospitality",
        example:
          "Céad míle fáilte romhat! (A hundred thousand welcomes to you!)",
        popularity: 70,
      },
    }),
    prisma.definition.upsert({
      where: {
        id: "go-raibh-maith-agat-def-1",
      },
      update: {},
      create: {
        id: "go-raibh-maith-agat-def-1",
        entryId: entries[3].id,
        definition: "Thank you; standard expression of gratitude",
        example:
          "Go raibh maith agat as an gcabhair! (Thank you for the help!)",
        popularity: 85,
      },
    }),
    prisma.definition.upsert({
      where: {
        id: "ta-se-go-maith-def-1",
      },
      update: {},
      create: {
        id: "ta-se-go-maith-def-1",
        entryId: entries[4].id,
        definition: "It's good; expression of approval or satisfaction",
        example: "Tá sé go maith ar fad! (It's very good!)",
        popularity: 65,
      },
    }),
  ]);

  console.log(`✅ Created ${definitions.length} definitions`);

  // Create variants
  const variants = await Promise.all([
    prisma.variant.upsert({
      where: {
        id: "slainte-var-1",
      },
      update: {},
      create: {
        id: "slainte-var-1",
        entryId: entries[0].id,
        variant: "sláinte",
        normalized: normalize("sláinte"),
        pronunciation: "slɑːntʃə",
        notes: "Standard pronunciation",
      },
    }),
    prisma.variant.upsert({
      where: {
        id: "slainte-var-2",
      },
      update: {},
      create: {
        id: "slainte-var-2",
        entryId: entries[0].id,
        variant: "slán",
        normalized: normalize("slán"),
        pronunciation: "slɑːn",
        notes: 'Shortened form, also means "goodbye"',
      },
    }),
  ]);

  console.log(`✅ Created ${variants.length} variants`);

  // Link entries to regions
  await Promise.all([
    prisma.entryRegion.upsert({
      where: {
        entryId_regionId: {
          entryId: entries[0].id,
          regionId: regions[0].id,
        },
      },
      update: {},
      create: {
        entryId: entries[0].id,
        regionId: regions[0].id,
      },
    }),
    prisma.entryRegion.upsert({
      where: {
        entryId_regionId: {
          entryId: entries[1].id,
          regionId: regions[1].id,
        },
      },
      update: {},
      create: {
        entryId: entries[1].id,
        regionId: regions[1].id,
      },
    }),
  ]);

  console.log("✅ Linked entries to regions");

  // Create sample sources
  const sources = await Promise.all([
    prisma.source.upsert({
      where: { id: "source-1" },
      update: {},
      create: {
        id: "source-1",
        entryId: entries[0].id,
        title: "Foclóir Gaeilge-Béarla",
        author: "Niall Ó Dónaill",
        publisher: "An Gúm",
        year: 1977,
        isbn: "9781857910373",
      },
    }),
    prisma.source.upsert({
      where: { id: "source-2" },
      update: {},
      create: {
        id: "source-2",
        entryId: entries[1].id,
        title: "Irish-English Dictionary",
        author: "Pádraig Ó Dónaill",
        publisher: "Cló Iar-Chonnacht",
        year: 2005,
      },
    }),
  ]);

  console.log(`✅ Created ${sources.length} sources`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch(e => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
