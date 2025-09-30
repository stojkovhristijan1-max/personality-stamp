# 🗄️ Supabase Setup Guide

## Overview

The Personality Stamp app works **without** Supabase using browser localStorage. This guide shows you how to optionally add Supabase for database persistence and cloud storage.

---

## Step 1: Create Supabase Project (5 minutes)

1. Go to [https://supabase.com](https://supabase.com)
2. Click "Start your project" (sign up if needed - it's free!)
3. Click "New project"
4. Fill in:
   - **Name**: personality-stamp (or any name)
   - **Database Password**: Choose a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free (perfect for this app)
5. Click "Create new project"
6. Wait 2-3 minutes for setup to complete

---

## Step 2: Get API Credentials

1. In your Supabase project, click "Settings" (gear icon) in sidebar
2. Click "API" in the settings menu
3. Find these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")
4. Keep this page open - you'll need these values next

---

## Step 3: Configure Environment Variables

1. In your project folder, create/edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace with YOUR values from Step 2
3. Save the file
4. **IMPORTANT**: Restart your dev server if it's running

```bash
# Stop server (Ctrl+C), then:
npm run dev
```

---

## Step 4: Create Database Table

1. In Supabase dashboard, click "SQL Editor" in sidebar
2. Click "New query"
3. Copy and paste the ENTIRE contents of `supabase-setup.sql` from your project
4. Click "Run" (or press Ctrl+Enter)
5. You should see "Success. No rows returned"

**What this does:**
- Creates `users` table with correct schema
- Sets up Row Level Security policies
- Creates storage policies for selfies

---

## Step 5: Create Storage Bucket

1. In Supabase dashboard, click "Storage" in sidebar
2. Click "New bucket"
3. Configure:
   - **Name**: `selfies` (exactly this name!)
   - **Public bucket**: ✅ **Toggle ON** (important!)
   - **File size limit**: 5 MB (default is fine)
4. Click "Create bucket"

**Why public?**: So the selfie images can be displayed on the digital ID without authentication.

---

## Step 6: Test Your Setup

1. Ensure dev server is running:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Click "Get Your Personality Stamp"

4. Fill out the form completely

5. Complete the personality test

6. Take a selfie

7. Check Supabase:
   - Go to "Table Editor" → `users` → You should see 1 row
   - Go to "Storage" → `selfies` → You should see `[uuid].jpg`

✅ **If you see your data, setup is complete!**

---

## Troubleshooting

### "Error saving data"
- ✅ Check `.env.local` has correct URL and key
- ✅ Restart dev server after adding env vars
- ✅ Ensure SQL script ran successfully
- ✅ Check browser console for specific errors

### Selfie not uploading
- ✅ Ensure `selfies` bucket is PUBLIC
- ✅ Storage policies should be created (from SQL script)
- ✅ Check Storage → Policies in Supabase dashboard

### Build errors mentioning Supabase
- ✅ This is normal if env vars are missing
- ✅ App will use localStorage fallback
- ✅ Add env vars to fix (optional)

### Data not appearing
- ✅ Open browser DevTools → Network tab
- ✅ Look for failed requests to Supabase
- ✅ Check if RLS policies are correct
- ✅ Verify table name is exactly `users`

---

## Database Schema Reference

### `users` Table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key (auto-generated) |
| `name` | TEXT | User's full name |
| `dob` | DATE | Date of birth |
| `nationality` | TEXT | User's nationality |
| `sex` | TEXT | male, female, or non-binary |
| `human_robot` | TEXT | human or robot |
| `personality_type` | TEXT | architect, visionary, artisan, etc. |
| `sigil_url` | TEXT | URL to sigil image (optional) |
| `selfie_url` | TEXT | URL to user's selfie |
| `created_at` | TIMESTAMP | Auto-generated |
| `updated_at` | TIMESTAMP | Auto-generated |

### Storage Bucket

- **Name**: `selfies`
- **Access**: Public
- **File naming**: `{user-id}.jpg`
- **Content-Type**: image/jpeg

---

## Deploying to Vercel with Supabase

When deploying to Vercel, add environment variables:

1. In Vercel dashboard → Your Project → Settings → Environment Variables
2. Add both variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Redeploy your app

**Note**: If you don't add these, the app will still work using localStorage!

---

## Security Notes

⚠️ **Current Setup**: Public access for demo purposes

For production apps, you should:
- Add user authentication (Supabase Auth)
- Restrict RLS policies to authenticated users
- Add server-side validation
- Limit file upload sizes
- Add rate limiting

---

## Cost Considerations

✅ **Supabase Free Tier includes:**
- 500 MB database space (plenty for thousands of users)
- 1 GB file storage (thousands of selfies)
- 50 MB bandwidth (resets monthly)
- Unlimited API requests

For this demo app, you'll **never** hit these limits! 🎉

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- Check the main README.md for app-specific issues

---

**That's it! Your database is ready.** 🚀

