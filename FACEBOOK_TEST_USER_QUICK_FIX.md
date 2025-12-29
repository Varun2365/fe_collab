# Quick Fix: Facebook Test User Pending Status

## Problem
You added yourself as a test user, but the status shows "Pending" and you can't test the OAuth flow.

## Solution 1: Accept Test User Invitation (If you want to use Test Users)

1. **Check Your Email**
   - Look for an email from Facebook about the test user invitation
   - Click the "Accept" link in the email

2. **Or Check Facebook Notifications**
   - Go to Facebook.com
   - Check your notifications
   - Look for a test user invitation notification
   - Click to accept

3. **Or Accept Directly in Developer Dashboard**
   - Go to your app: https://developers.facebook.com/apps/
   - Click on your app
   - Go to "Roles" → "Test Users"
   - Find your test user
   - If it says "Pending", click on it
   - You might see an "Accept" or "Authorize" button

## Solution 2: Add Yourself as Developer/Admin (INSTANT - RECOMMENDED)

This is the **fastest and easiest** way - no approval needed!

1. **Go to Roles**
   - In your Facebook App dashboard
   - Click "Roles" in the left sidebar
   - Click on "Roles" tab (not "Test Users")

2. **Add Yourself**
   - Click "Add People" button
   - Enter your Facebook email address or name
   - Select role: **"Administrator"** or **"Developer"**
   - Click "Add"

3. **That's It!**
   - You'll have immediate access
   - No approval needed
   - You can test OAuth right away

## Why Developer/Admin is Better for Testing

- ✅ **Instant access** - No waiting for approval
- ✅ **Full permissions** - Can test all features
- ✅ **No limitations** - Same as production access
- ✅ **Easier to manage** - One less thing to worry about

## After Adding Yourself as Developer/Admin

1. **Restart your backend** (if it's running)
2. **Go to your dashboard**: `http://localhost:5173/ads`
3. **Click "Connect Meta"**
4. **Log in with your Facebook account** (the one you added as Developer)
5. **Authorize the app**
6. **You should be redirected back** and see "Meta account connected"

## Troubleshooting

### Still showing as not connected?
- Check backend console logs for errors
- Make sure `META_APP_ID` and `META_APP_SECRET` are set in `.env`
- Make sure you restarted the backend after adding env variables
- Try disconnecting and reconnecting

### Getting "App not available" error?
- Make sure you're logging in with the SAME Facebook account you added as Developer
- Check that the app is not in "Restricted" mode
- Verify the redirect URI is correct in Facebook App settings

### OAuth redirect not working?
- Verify redirect URI in Facebook App: `http://localhost:8080/api/marketing/v1/credentials/meta/oauth/callback`
- Must match EXACTLY (no trailing slash, correct port)
- Check backend logs for the actual redirect URL being used

