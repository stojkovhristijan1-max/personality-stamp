# ⚡ Quick Reference Card

## 🚀 Run Locally (30 seconds)

```bash
npm install
npm run dev
```
Open: http://localhost:3000

---

## 📦 Deploy to Vercel (5 minutes)

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/personality-stamp.git
git push -u origin main
```

Then:
1. Go to [vercel.com](https://vercel.com)
2. Import repository
3. Click "Deploy"
4. Done! ✅

---

## 🗄️ Supabase Setup (Optional - 10 minutes)

1. Create project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase-setup.sql`
3. Create `selfies` bucket (PUBLIC)
4. Get URL + Key from Settings → API
5. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
6. Restart dev server

---

## 📁 Project Structure

```
app/
├── page.tsx              → Home
├── personal-info/        → Form
├── personality-test/     → Quiz  
├── digital-id/           → ID Card
└── share/[userId]/       → Public View
```

---

## 🎯 User Flow

```
Home → Personal Info → Quiz (10 Q) → Results → Digital ID
                                                    ↓
                                        Selfie, Download, Share
```

---

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm start` | Run production build |
| `vercel` | Deploy to Vercel |

---

## 🌐 Routes

| Route | Page |
|-------|------|
| `/` | Home page |
| `/personal-info` | Personal info form |
| `/personality-test?userId=xxx` | Quiz |
| `/digital-id?userId=xxx` | Digital ID card |
| `/share/:userId` | Public share page |

---

## 📝 Environment Variables

**Optional** (only if using Supabase):

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

**Location**:
- Local: `.env.local` (create this file)
- Vercel: Settings → Environment Variables

---

## 🎨 Personality Types

1. **Architect** - Blue/Indigo - Structured
2. **Visionary** - Purple/Pink - Innovative  
3. **Artisan** - Amber/Orange - Practical
4. **Catalyst** - Red/Rose - Energetic
5. **Harmonizer** - Green/Emerald - Empathetic
6. **Innovator** - Cyan/Blue - Tech-savvy

---

## 🗃️ Database Schema (Supabase)

**Table: users**
```
id UUID PRIMARY KEY
name TEXT
dob DATE
nationality TEXT
sex TEXT
human_robot TEXT
personality_type TEXT
sigil_url TEXT
selfie_url TEXT
```

**Storage: selfies bucket** (PUBLIC)
- Files: `{userId}.jpg`

---

## ✅ Testing Checklist

- [ ] Home page loads
- [ ] Form validates
- [ ] Quiz progresses
- [ ] Results calculate
- [ ] Camera works (HTTPS)
- [ ] Download works
- [ ] Share link copies
- [ ] Mobile responsive

---

## 🐛 Troubleshooting

**Camera not working?**
→ Needs HTTPS (Vercel auto-provides)

**Build fails?**
→ Run `npm run build` locally first

**Supabase not connecting?**
→ Check env vars, restart server

**Data not saving?**
→ App uses localStorage by default ✅

---

## 📚 Documentation

- `README.md` - Complete guide
- `QUICKSTART.md` - 2-minute setup
- `DEPLOY_TO_VERCEL.md` - Deployment steps
- `SUPABASE_SETUP_GUIDE.md` - Database setup
- `PROJECT_SUMMARY.md` - Overview
- `FEATURES.md` - All features list

---

## 🔗 Useful Links

- **Vercel**: https://vercel.com
- **Supabase**: https://supabase.com
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind**: https://tailwindcss.com/docs

---

## 💡 Quick Tips

✅ App works WITHOUT database (uses localStorage)  
✅ Deploys to Vercel free tier  
✅ Camera requires HTTPS (Vercel provides)  
✅ Download uses html2canvas  
✅ Share creates read-only public link  
✅ Dark mode auto-detects system preference  

---

## 🆘 Need Help?

1. Check the relevant `.md` file above
2. Review browser console (F12)
3. Check Vercel deployment logs
4. Verify all files committed to Git

---

**Quick Start**: `npm install && npm run dev`

**Deploy**: Push to GitHub → Import to Vercel

**Done!** 🎉

