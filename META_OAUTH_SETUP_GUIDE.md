# Meta (Facebook) OAuth Setup Guide - Step by Step

## Overview
This guide will help you set up a Facebook App for OAuth authentication to connect Meta accounts to your FunnelsEye dashboard.

---

## Step 1: Create a Facebook App

1. **Go to Facebook Developers**
   - Visit: https://developers.facebook.com/
   - Log in with your Facebook account (use a business account if possible)

2. **Create a New App**
   - Click "My Apps" in the top right
   - Click "Create App"
   - Select "Business" as the app type
   - Click "Next"

3. **Fill in App Details**
   - **App Name**: `FunnelsEye Marketing Integration` (or your preferred name)
   - **App Contact Email**: Your email address
   - **Business Account**: Select or create a business account (optional but recommended)
   - Click "Create App"

---

## Step 2: Add Facebook Login Product

1. **Add Product**
   - In your app dashboard, find "Add Product" or the "+" button
   - Look for "Facebook Login" and click "Set Up"

2. **Choose Platform**
   - Select "Web" as the platform
   - Click "Next"

---

## Step 3: Configure OAuth Settings

1. **Go to Facebook Login Settings**
   - In the left sidebar, click "Facebook Login" → "Settings"

2. **Add Valid OAuth Redirect URIs**
   - Under "Valid OAuth Redirect URIs", add:
     ```
     http://localhost:8080/api/marketing/v1/credentials/meta/oauth/callback
     ```
   - **For Production**, also add:
     ```
     https://api.funnelseye.com/api/marketing/v1/credentials/meta/oauth/callback
     ```
   - Click "Save Changes"

3. **Important Notes**:
   - The redirect URI must match EXACTLY (including http/https, port, and path)
   - No trailing slashes
   - No query parameters in the redirect URI

---

## Step 4: Configure App Permissions (Scopes)

1. **Go to App Review**
   - In the left sidebar, click "App Review" → "Permissions and Features"

2. **Request Required Permissions**
   You need to request these permissions:
   - `ads_management` - Manage ads
   - `ads_read` - Read ads data
   - `business_management` - Manage business accounts
   - `pages_read_engagement` - Read page engagement
   - `pages_manage_posts` - Manage page posts
   - `instagram_basic` - Basic Instagram access
   - `instagram_content_publish` - Publish Instagram content

3. **For Development/Testing**:
   - If your app is in "Development Mode", you can use these permissions without review
   - Only users added as "Test Users" or "Developers" can use the app
   - To make it public, you'll need to submit for App Review

4. **Add Test Users (For Development)**:
   - Go to "Roles" → "Test Users"
   - Click "Add Test Users"
   - Add yourself as a test user

---

## Step 5: Get Your App Credentials

1. **Go to Settings → Basic**
   - In the left sidebar, click "Settings" → "Basic"

2. **Copy Your Credentials**:
   - **App ID**: Copy this value
   - **App Secret**: Click "Show" and copy this value
   - **Keep these secure!**

---

## Step 6: Configure Environment Variables

1. **Add to your `.env` file** (in the `backend-v` folder):
   ```env
   META_APP_ID=your_app_id_here
   META_APP_SECRET=your_app_secret_here
   FRONTEND_URL=http://localhost:5173
   ```

2. **For Production**, update:
   ```env
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Restart your backend server** after adding these variables

---

## Step 7: Configure App Domain (Optional but Recommended)

1. **Go to Settings → Basic**
   - Scroll down to "App Domains"
   - Add your domain (e.g., `funnelseye.com`)
   - For localhost, you can skip this

2. **Add Website URL**
   - Under "Website", add:
     - Development: `http://localhost:5173`
     - Production: `https://your-frontend-domain.com`

---

## Step 8: Test the OAuth Flow

1. **Make sure your backend is running**
   ```bash
   cd backend-v
   npm start
   ```

2. **Make sure your frontend is running**
   ```bash
   cd frontend-j
   npm run dev
   ```

3. **Test the Connection**:
   - Go to your dashboard: `http://localhost:5173/ads`
   - Click "Connect Meta"
   - You should be redirected to Facebook
   - Log in and authorize the app
   - You should be redirected back to your dashboard

---

## Step 9: Troubleshooting

### Issue: "Invalid OAuth Redirect URI"
**Solution**: 
- Check that the redirect URI in Facebook App settings matches exactly:
  - `http://localhost:8080/api/marketing/v1/credentials/meta/oauth/callback`
- Make sure there are no trailing slashes or extra characters

### Issue: "App Not Setup: This app is still in development mode"
**Solution**:
- Add yourself as a Test User in "Roles" → "Test Users"
- Or submit your app for App Review (takes 7-14 days)

### Issue: "Insufficient Permissions"
**Solution**:
- Make sure all required permissions are added in "App Review" → "Permissions and Features"
- For development, add yourself as a Test User

### Issue: "Credentials saved but still shows as not connected"
**Solution**:
- Check backend logs for verification errors
- The token might be invalid or expired
- Try disconnecting and reconnecting
- Check that `META_APP_ID` and `META_APP_SECRET` are set correctly

### Issue: "State parameter invalid"
**Solution**:
- Make sure you're completing the OAuth flow within 10 minutes
- Don't refresh the page during the OAuth flow

---

## Step 10: Production Setup

1. **Submit App for Review** (if making public):
   - Go to "App Review" → "Permissions and Features"
   - Request each permission with use case descriptions
   - Submit for review (takes 7-14 days)

2. **Update Redirect URIs**:
   - Add production callback URL:
     ```
     https://api.funnelseye.com/api/marketing/v1/credentials/meta/oauth/callback
     ```

3. **Update Environment Variables**:
   - Set `FRONTEND_URL` to your production frontend URL
   - Make sure `META_APP_ID` and `META_APP_SECRET` are set

4. **Switch App to Live Mode**:
   - Go to "App Review" → "Permissions and Features"
   - Toggle "Make [App Name] public" to ON

---

## Quick Checklist

- [ ] Facebook App created
- [ ] Facebook Login product added
- [ ] OAuth Redirect URI configured correctly
- [ ] Required permissions added
- [ ] App ID and App Secret copied
- [ ] Environment variables set in `.env`
- [ ] Backend server restarted
- [ ] Test user added (for development)
- [ ] OAuth flow tested successfully

---

## Need Help?

If you're still having issues:
1. Check the browser console for errors
2. Check backend logs for detailed error messages
3. Verify all URLs match exactly (no typos, correct ports)
4. Make sure you're using the correct Facebook account (the one that owns the app)

