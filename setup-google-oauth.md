# Google OAuth Setup Guide

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" > "New Project"
3. Enter project name: `focloireacht`
4. Click "Create"

## Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" or "Google Identity"
3. Click on "Google Identity" and enable it

## Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Enter name: `Focloireacht Web Client`
5. Add authorized redirect URIs:
   ```
   https://focloireacht-idk39e8z8-ferg-flannerys-projects.vercel.app/api/auth/callback/google
   ```
6. Click "Create"
7. Copy the Client ID and Client Secret

## Step 4: Configure Vercel Environment Variables

Add these to your Vercel project environment variables:

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Step 5: OAuth Consent Screen (Optional)

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required fields:
   - App name: `Focloireacht`
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
5. Add test users (for development)

## Testing

After setting up, users will be able to:

1. Click "Sign in" on your site
2. Choose "Continue with Google"
3. Complete OAuth flow
4. Be redirected back to your application

## Troubleshooting

- Make sure redirect URI exactly matches your Vercel URL
- Ensure OAuth consent screen is configured
- Check that Google Identity API is enabled
- Verify environment variables are set in Vercel
