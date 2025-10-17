#!/bin/bash

echo "🍀 Focloireacht Quick Setup"
echo "========================="
echo ""

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your database and OAuth credentials first."
    echo ""
    echo "Required variables:"
    echo "- DATABASE_URL"
    echo "- NEXTAUTH_SECRET"
    echo "- NEXTAUTH_URL"
    echo "- GOOGLE_CLIENT_ID"
    echo "- GOOGLE_CLIENT_SECRET"
    echo ""
    exit 1
fi

echo "✅ Environment file found"
echo ""

# Load environment variables
source .env.local

# Check required variables
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set in .env.local"
    exit 1
fi

if [ -z "$GOOGLE_CLIENT_ID" ]; then
    echo "❌ GOOGLE_CLIENT_ID not set in .env.local"
    exit 1
fi

echo "✅ Environment variables configured"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️  Setting up database schema..."
npm run db:push

# Seed database
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🚀 Starting development server..."
echo "Visit: http://localhost:3000"
echo ""

# Start development server
npm run dev


