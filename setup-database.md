# Database Setup Guide for Focloireacht

## Option 1: Supabase (Recommended)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Sign in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `focloireacht`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

### Step 2: Get Database URL

1. Go to Settings > Database
2. Copy the "Connection string" under "Connection parameters"
3. Replace `[YOUR-PASSWORD]` with your database password
4. Example: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Step 3: Enable pg_trgm Extension

1. Go to SQL Editor in Supabase dashboard
2. Run this query:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Step 4: Run Migrations

```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed the database
npm run db:seed
```

## Option 2: Neon (Alternative)

### Step 1: Create Neon Project

1. Go to [neon.tech](https://neon.tech)
2. Sign up/Sign in
3. Click "Create Project"
4. Enter project details:
   - Name: `focloireacht`
   - Region: Choose closest to your users
5. Click "Create"

### Step 2: Get Connection String

1. Copy the connection string from the dashboard
2. It will look like: `postgresql://[user]:[password]@[host]/[database]?sslmode=require`

### Step 3: Enable pg_trgm Extension

1. Go to SQL Editor in Neon dashboard
2. Run: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`

### Step 4: Run Migrations

```bash
export DATABASE_URL="your-neon-connection-string"
npm run db:generate
npm run db:push
npm run db:seed
```

## Option 3: Railway (Alternative)

### Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign up/Sign in
3. Click "New Project"
4. Choose "Provision PostgreSQL"
5. Wait for database to be ready

### Step 2: Get Connection Details

1. Click on your PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection string

### Step 3: Enable pg_trgm Extension

1. Go to "Query" tab
2. Run: `CREATE EXTENSION IF NOT EXISTS pg_trgm;`

### Step 4: Run Migrations

```bash
export DATABASE_URL="your-railway-connection-string"
npm run db:generate
npm run db:push
npm run db:seed
```

## Environment Variables for Vercel

After setting up your database, add these environment variables in your Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Go to Settings > Environment Variables
3. Add these variables:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
NEXTAUTH_SECRET=[generate-a-secure-secret]
NEXTAUTH_URL=https://focloireacht-idk39e8z8-ferg-flannerys-projects.vercel.app
```

## Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Or use this online generator: https://generate-secret.vercel.app/32
