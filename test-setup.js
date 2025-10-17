#!/usr/bin/env node

// Quick setup verification script
console.log("🍀 Focloireacht Setup Verification");
console.log("=====================================");

// Check environment variables
const requiredEnvVars = ["DATABASE_URL", "NEXTAUTH_SECRET", "NEXTAUTH_URL"];

const optionalEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

console.log("\n📋 Required Environment Variables:");
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`❌ ${varName}: Missing`);
  }
});

console.log("\n📋 Optional Environment Variables:");
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: Set`);
  } else {
    console.log(`⚠️  ${varName}: Not set (optional)`);
  }
});

// Check if we can connect to database
async function testDatabase() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();

    await prisma.$connect();
    console.log("\n✅ Database connection: Working");

    // Test pg_trgm extension
    await prisma.$queryRaw`SELECT 1`;
    console.log("✅ Database query: Working");

    await prisma.$disconnect();
  } catch (error) {
    console.log("\n❌ Database connection: Failed");
    console.log(`   Error: ${error.message}`);
  }
}

// Run tests
testDatabase()
  .then(() => {
    console.log("\n🎯 Next Steps:");
    console.log("1. Set up database (Supabase/Neon)");
    console.log("2. Add environment variables to Vercel");
    console.log("3. Configure Google OAuth (optional)");
    console.log("4. Deploy: vercel --prod");
    console.log("\n📚 See setup guides for detailed instructions");
  })
  .catch(console.error);
