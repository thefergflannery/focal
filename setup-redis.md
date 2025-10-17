# Redis Setup Guide (Optional)

## Option 1: Upstash Redis (Recommended)

### Step 1: Create Upstash Account

1. Go to [upstash.com](https://upstash.com)
2. Sign up/Sign in
3. Click "Create Database"
4. Choose region closest to your users
5. Click "Create"

### Step 2: Get Connection Details

1. Click on your database
2. Copy the REST URL and REST Token
3. Add to Vercel environment variables:
   ```
   UPSTASH_REDIS_REST_URL=your-upstash-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   ```

## Option 2: Redis Cloud (Alternative)

### Step 1: Create Redis Cloud Account

1. Go to [redis.com](https://redis.com/redis-enterprise-cloud/)
2. Sign up for free account
3. Create a new database
4. Choose region and plan

### Step 2: Get Connection String

1. Copy the connection string
2. Extract URL and token for Upstash format
3. Add to Vercel environment variables

## Option 3: Skip Redis (Development)

If you don't need rate limiting for now, you can skip Redis setup. The application will work without it, but rate limiting features will be disabled.

## What Redis is Used For

- API rate limiting (search, votes, submissions)
- Session storage (if using Redis adapter)
- Caching frequently accessed data
- Preventing spam and abuse

## Testing Rate Limiting

After setup, you can test rate limiting by:

1. Making multiple API requests quickly
2. Checking if rate limit headers are returned
3. Verifying that limits are enforced per IP/user
