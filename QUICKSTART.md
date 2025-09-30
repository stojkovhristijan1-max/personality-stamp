# 🚀 Quick Start Guide

## Run Locally in 2 Minutes

1. **Install dependencies** (first time only):
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open in browser**:
```
http://localhost:3000
```

That's it! The app works without any configuration. 🎉

---

## Deploy to Vercel (5 Minutes)

### Option 1: GitHub Deploy (Recommended)

1. **Push to GitHub**:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy" (Vercel auto-detects Next.js)

3. **Done!** Your app is live at `your-project.vercel.app`

### Option 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## Optional: Add Supabase Database

The app works without a database using browser localStorage. To add persistence:

1. Create free account at https://supabase.com
2. Create new project
3. Go to Settings → API
4. Copy URL and anon key
5. Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-url-here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```
6. In Supabase SQL Editor, run the SQL from `supabase-setup.sql`
7. Create storage bucket named `selfies` (make it public)
8. Restart dev server

---

## Troubleshooting

**Build taking too long?**
- Press Ctrl+C and try again
- The first build takes 30-60 seconds

**Camera not working?**
- Needs HTTPS (Vercel provides this)
- Check browser permissions
- Try Chrome or Edge

**Deploy fails?**
- Make sure all files are committed
- Check Vercel logs
- Env vars are optional - don't need them for basic deployment

---

## Need Help?

Check the full README.md for detailed documentation!

