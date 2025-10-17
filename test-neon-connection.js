#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// Test script to verify Neon database connection
const { PrismaClient } = require("@prisma/client");

async function testConnection() {
  console.log("🔍 Testing Neon Database Connection...");
  console.log("=====================================");

  if (!process.env.DATABASE_URL) {
    console.log("❌ DATABASE_URL not found in environment variables");
    console.log(
      "Please create .env.local file with your Neon connection string"
    );
    process.exit(1);
  }

  console.log("✅ DATABASE_URL found");
  console.log(
    `📍 Host: ${process.env.DATABASE_URL.split("@")[1]?.split("/")[0] || "Unknown"}`
  );

  const prisma = new PrismaClient();

  try {
    // Test basic connection
    console.log("🔄 Testing database connection...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Test pg_trgm extension
    console.log("🔄 Testing pg_trgm extension...");
    const result =
      await prisma.$queryRaw`SELECT extname FROM pg_extension WHERE extname = 'pg_trgm'`;

    if (result.length > 0) {
      console.log("✅ pg_trgm extension is enabled");
    } else {
      console.log("⚠️  pg_trgm extension not found");
      console.log(
        "   Run this in Neon SQL Editor: CREATE EXTENSION IF NOT EXISTS pg_trgm;"
      );
    }

    // Test if tables exist
    console.log("🔄 Checking database schema...");
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    `;

    if (tables.length > 0) {
      console.log(`✅ Found ${tables.length} tables in database`);
      console.log("   Tables:", tables.map(t => t.table_name).join(", "));
    } else {
      console.log("ℹ️  No tables found - ready for schema setup");
    }

    console.log("\n🎉 Neon database is ready for Focloireacht!");
    console.log("\nNext steps:");
    console.log("1. Run: npm run db:generate");
    console.log("2. Run: npm run db:push");
    console.log("3. Run: npm run db:seed");
  } catch (error) {
    console.log("❌ Database connection failed:");
    console.log(`   Error: ${error.message}`);

    if (error.message.includes("P1001")) {
      console.log("\n💡 Troubleshooting:");
      console.log("   - Check your DATABASE_URL format");
      console.log("   - Verify your Neon project is active");
      console.log("   - Ensure your connection string is correct");
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Load environment variables from .env.local
require("dotenv").config({ path: ".env.local" });

testConnection().catch(console.error);
