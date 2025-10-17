#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

// Test script to verify OAuth configuration
require("dotenv").config({ path: ".env.local" });

console.log("🔐 Testing OAuth Configuration...");
console.log("==================================");

// Check required environment variables
const requiredVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];

let allConfigured = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: Not set`);
    allConfigured = false;
  } else if (value.includes("REPLACE_WITH_") || value.includes("your-")) {
    console.log(
      `⚠️  ${varName}: Needs to be configured (currently: ${value.substring(0, 20)}...)`
    );
    allConfigured = false;
  } else {
    console.log(`✅ ${varName}: Configured`);
  }
});

console.log("");

if (allConfigured) {
  console.log("🎉 OAuth configuration is complete!");
  console.log("");
  console.log("🚀 You can now:");
  console.log("1. Start the development server: npm run dev");
  console.log("2. Visit: http://localhost:3000");
  console.log('3. Click "Sign in" to test Google OAuth');
  console.log("");
  console.log("📋 Make sure your Google OAuth app has this redirect URI:");
  console.log("   http://localhost:3000/api/auth/callback/google");
} else {
  console.log("⚠️  OAuth configuration is incomplete");
  console.log("");
  console.log("📋 Next steps:");
  console.log("1. Get your Google Client Secret from Google Cloud Console");
  console.log("2. Replace REPLACE_WITH_YOUR_CLIENT_SECRET in .env.local");
  console.log("3. Configure redirect URIs in Google Cloud Console");
  console.log("4. Run this test again: node test-oauth-config.js");
}

console.log("");
