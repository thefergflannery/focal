# 🔐 Authentication Troubleshooting Guide

## 400 Error During Sign-Up - Common Causes & Solutions

### ✅ **What We Fixed**

- ✅ Added proper user creation in signIn callback
- ✅ Fixed JWT token handling without Prisma adapter
- ✅ Added error logging and debugging
- ✅ All environment variables are set in Vercel

### 🔍 **Most Common 400 Error Causes**

#### 1. **Google OAuth Redirect URI Mismatch** (Most Common)

**Problem**: The redirect URI in Google Cloud Console doesn't match your Vercel URL.

**Solution**:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to APIs & Services > Credentials
3. Click on your OAuth 2.0 Client ID
4. Add this exact redirect URI:
   ```
   https://focloireacht-1uem2v7cp-ferg-flannerys-projects.vercel.app/api/auth/callback/google
   ```
5. Make sure there are no trailing slashes or extra characters

#### 2. **Google OAuth Consent Screen Issues**

**Problem**: OAuth consent screen not properly configured.

**Solution**:

1. Go to APIs & Services > OAuth consent screen
2. Ensure it's configured for "External" user type
3. Add your domain to authorized domains
4. Add test users if in testing mode

#### 3. **Environment Variables Issues**

**Problem**: Missing or incorrect environment variables.

**Current Status**: ✅ All variables are set in Vercel:

- ✅ GOOGLE_CLIENT_ID
- ✅ GOOGLE_CLIENT_SECRET
- ✅ NEXTAUTH_SECRET
- ✅ NEXTAUTH_URL
- ✅ DATABASE_URL

#### 4. **Database Connection Issues**

**Problem**: User creation fails due to database issues.

**Solution**: We've added proper error handling and logging.

### 🧪 **Testing Steps**

1. **Check Current Deployment**:

   ```
   https://focloireacht-1uem2v7cp-ferg-flannerys-projects.vercel.app
   ```

2. **Test Sign-In Flow**:
   - Go to `/auth/signin`
   - Click "Continue with Google"
   - Check browser console for errors
   - Check Vercel function logs

3. **Verify Google OAuth Setup**:
   - Ensure redirect URI matches exactly
   - Check OAuth consent screen is configured
   - Verify client ID and secret are correct

### 🔧 **Debugging Tools**

#### Check Vercel Logs:

```bash
vercel logs [deployment-url]
```

#### Check Browser Console:

- Open DevTools (F12)
- Go to Console tab
- Try sign-in and look for errors

#### Test Environment Variables:

```bash
# Check if all required vars are set
vercel env ls
```

### 🚨 **If Still Getting 400 Error**

1. **Double-check Google OAuth redirect URI** (most common issue)
2. **Verify OAuth consent screen is published**
3. **Check Vercel function logs for specific error messages**
4. **Try with a different Google account**
5. **Ensure Google Identity API is enabled**

### 📞 **Next Steps**

If the issue persists:

1. Check the exact error message in browser console
2. Check Vercel function logs for detailed error info
3. Verify Google OAuth configuration matches exactly
4. Test with a fresh Google account

### 🎯 **Expected Behavior After Fix**

Once working, you should see:

- ✅ Google OAuth popup opens
- ✅ User can authorize the application
- ✅ User is redirected back to your app
- ✅ User appears in your database
- ✅ User can access protected routes

### 📋 **Quick Checklist**

- [ ] Google OAuth redirect URI matches Vercel URL exactly
- [ ] OAuth consent screen is configured and published
- [ ] All environment variables are set in Vercel
- [ ] Google Identity API is enabled
- [ ] Database connection is working
- [ ] Latest deployment is live

**Your latest deployment**: https://focloireacht-1uem2v7cp-ferg-flannerys-projects.vercel.app
