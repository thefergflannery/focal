# Focloireacht - Irish Language Dictionary

A comprehensive Irish language dictionary built with Next.js 14, TypeScript, and modern web technologies. This project allows users to search, contribute, and learn Irish words and phrases with regional variations and community-driven definitions.

## 🌟 Features

- **Advanced Search**: Full-text search with PostgreSQL FTS and fuzzy matching using pg_trgm
- **Regional Variants**: Words organized by Irish language regions (Gaeltacht areas)
- **Community Contributions**: User-submitted entries with moderation system
- **Authentication**: NextAuth.js with Google OAuth and email magic links
- **Voting System**: Community-driven quality control through upvotes/downvotes
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support
- **Rate Limiting**: Upstash Redis for API protection
- **Monitoring**: Sentry integration for error tracking

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (Auth.js)
- **UI**: Tailwind CSS + shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod validation
- **Search**: PostgreSQL Full-Text Search + pg_trgm
- **Rate Limiting**: Upstash Redis
- **Email**: Resend
- **Monitoring**: Sentry
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis instance (Upstash recommended)

### 1. Clone and Install

```bash
git clone <repository-url>
cd focloireacht
npm install
```

### 2. Environment Setup

Copy the example environment file and configure your variables:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/focloireacht"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (Resend)
RESEND_API_KEY="your-resend-api-key"

# Redis (Upstash)
UPSTASH_REDIS_REST_URL="your-upstash-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-redis-token"

# Monitoring (optional)
SENTRY_DSN="your-sentry-dsn"
PLAUSIBLE_DOMAIN="your-domain.com"
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (for development)
npm run db:push

# Or run migrations (for production)
npm run db:migrate

# Seed the database with sample data
npm run db:seed
```

### 4. Development

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

The application uses a comprehensive schema with the following main entities:

- **Users**: Authentication and role management (ADMIN, EDITOR, CONTRIBUTOR)
- **Entries**: Irish words and phrases with metadata
- **Definitions**: Multiple definitions per entry with examples
- **Variants**: Regional variations and pronunciations
- **Regions**: Gaeltacht areas and dialect regions
- **Votes**: Community voting system for definitions
- **Submissions**: User contributions awaiting moderation
- **Sources**: Reference materials and citations

## 🔍 Search Features

### Full-Text Search

- PostgreSQL FTS across headwords and definitions
- Language-aware search with English stemming
- Phrase and proximity queries

### Fuzzy Matching

- pg_trgm extension for similarity search
- Handles spelling variations and typos
- Configurable similarity thresholds

### Text Normalization

- Diacritic removal for broader matching
- Case-insensitive search
- Normalized storage for performance

## 🔐 Authentication & Authorization

### User Roles

- **CONTRIBUTOR**: Can submit new entries and definitions
- **EDITOR**: Can review and moderate submissions
- **ADMIN**: Full system access and user management

### Protected Routes

- `/submit`: Requires authentication
- `/queue`: Requires EDITOR or ADMIN role

## 📝 Contributing

### Submission Process

1. Users submit new entries, definitions, or variants
2. Submissions are stored with PENDING status
3. Editors review and approve/reject submissions
4. Approved submissions become live entries

### Quality Control

- Community voting on definitions
- Editor moderation system
- Source attribution and citations

## 🚀 Deployment

### ✅ Already Deployed!

**Live URL:** https://focloireacht-idk39e8z8-ferg-flannerys-projects.vercel.app

Your application is already deployed to Vercel! To make it fully functional, follow the setup guides:

### Quick Setup Steps:

1. **Set up Database** (Required):
   - See `setup-database.md` for Supabase/Neon/Railway setup
   - Enable pg_trgm extension
   - Add `DATABASE_URL` to Vercel environment variables

2. **Configure Authentication** (Required):
   - See `setup-google-oauth.md` for Google OAuth setup
   - Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to Vercel
   - Generate and add `NEXTAUTH_SECRET`

3. **Optional Enhancements**:
   - See `setup-redis.md` for rate limiting
   - Configure monitoring and analytics
   - Set up email notifications

### Environment Variables

Copy the template from `production-env-template.txt` and add to Vercel dashboard under Settings > Environment Variables.

### Environment Variables for Production

Set these in your deployment platform:

```env
DATABASE_URL=your-production-database-url
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-domain.com
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RESEND_API_KEY=your-resend-api-key
UPSTASH_REDIS_REST_URL=your-upstash-redis-url
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
SENTRY_DSN=your-sentry-dsn
PLAUSIBLE_DOMAIN=your-domain.com
```

### Database Setup

For production, use a managed PostgreSQL service:

1. **Supabase** (recommended): Easy setup with built-in features
2. **Neon**: Serverless PostgreSQL
3. **PlanetScale**: MySQL-compatible with branching
4. **Railway**: Simple PostgreSQL hosting

Enable the `pg_trgm` extension:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Database
npm run db:generate     # Generate Prisma client
npm run db:push         # Push schema changes
npm run db:migrate      # Run migrations
npm run db:seed         # Seed database
npm run db:studio       # Open Prisma Studio

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format with Prettier
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── word/[slug]/       # Individual word pages
│   ├── regions/           # Region pages
│   ├── submit/            # Submission form
│   └── queue/             # Moderation queue
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── db.ts             # Prisma client
│   ├── search.ts         # Search functionality
│   ├── votes.ts          # Voting system
│   └── text-utils.ts     # Text normalization
└── types/                # TypeScript type definitions

prisma/
├── schema.prisma         # Database schema
├── seed.ts              # Database seeding
└── migrations/          # Database migrations
```

## 🔧 Configuration

### Tailwind CSS

Custom configuration with design tokens and component variants.

### ESLint + Prettier

Code quality and formatting with pre-commit hooks.

### Husky

Git hooks for automated quality checks.

## 📚 API Documentation

### Search API

```
GET /api/search?q=query&limit=20&offset=0
```

### Submissions API

```
POST /api/submissions
GET /api/submissions?status=PENDING
```

### Votes API

```
POST /api/votes
```

### Regions API

```
GET /api/regions
GET /api/regions?slug=region-slug
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Irish language community for inspiration and feedback
- Contributors and volunteers who help maintain the dictionary
- Open source projects that make this possible

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**Focloireacht** - Building bridges through the Irish language 🍀

# Deployment trigger Fri Oct 17 08:52:33 IST 2025
