# 🔐 Setting Up Environment Variables on Vercel

## Quick Setup Guide

### Step 1: Go to Vercel Project Settings

1. Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your **Cofndrly** project
3. Go to **Settings** → **Environment Variables**

### Step 2: Add Firebase Variables

Add these 7 environment variables:

| Variable Name | Value |
|--------------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyCpRqGo-fk0X5diLDnI6EU98_Z6EVPVlNU` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `cofndrly.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `cofndrly` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `cofndrly.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `1067330815849` |
| `VITE_FIREBASE_APP_ID` | `1:1067330815849:web:badaef59f70cd8748edff8` |
| `VITE_FIREBASE_MEASUREMENT_ID` | `G-C98P4TZT0S` |

**For each variable:**
1. Click **Add New**
2. Enter the **Key** (variable name)
3. Enter the **Value** (from table above)
4. Select environment: **Production**, **Preview**, and **Development** (all three)
5. Click **Save**

### Step 3: Redeploy

After adding all variables:
1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy**

---

## Alternative: Keep Credentials in Code (Not Recommended for Production)

If you want to deploy quickly without setting up environment variables:
- The code now has fallback values
- It will work but credentials will be visible in your GitHub repo
- **Better to use environment variables for security**

---

## Local Development

For local development with environment variables:

1. Create `.env.local` file in your project root:
```bash
VITE_FIREBASE_API_KEY=AIzaSyCpRqGo-fk0X5diLDnI6EU98_Z6EVPVlNU
VITE_FIREBASE_AUTH_DOMAIN=cofndrly.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cofndrly
VITE_FIREBASE_STORAGE_BUCKET=cofndrly.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1067330815849
VITE_FIREBASE_APP_ID=1:1067330815849:web:badaef59f70cd8748edff8
VITE_FIREBASE_MEASUREMENT_ID=G-C98P4TZT0S
```

2. This file is already in `.gitignore` so it won't be committed

---

## Security Notes

✅ **Firebase API keys are safe to expose** in client-side code (they're meant to be public)
✅ Security is enforced by **Firebase Security Rules** (which we already set up)
✅ Using environment variables is still best practice for easy config management

---

## What Changed in the Code

The Firebase config now uses:
```typescript
apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "fallback_value"
```

This means:
- **On Vercel**: Uses environment variables you set
- **Locally**: Uses `.env.local` if it exists, otherwise uses fallback
- **Fallback**: Hardcoded values work but aren't ideal for production

