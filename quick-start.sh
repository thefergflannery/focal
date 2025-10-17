#!/bin/bash

echo "🍀 Focloireacht Quick Start"
echo "=========================="
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not set"
    echo "Please set your database URL first:"
    echo "export DATABASE_URL='postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres'"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ DATABASE_URL is set"
echo ""

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Push schema to database
echo "🗄️  Pushing database schema..."
npm run db:push

# Seed database with sample data
echo "🌱 Seeding database with sample data..."
npm run db:seed

echo ""
echo "🎉 Database setup complete!"
echo ""
echo "Next steps:"
echo "1. Add environment variables to Vercel dashboard"
echo "2. Run: vercel --prod"
echo "3. Test your application at the deployed URL"
echo ""
echo "Your app will be ready for the Irish language community! 🍀"
