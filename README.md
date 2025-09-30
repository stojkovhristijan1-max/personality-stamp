# Personality Stamp 🎭

A beautiful web application that issues unique personality stamps based on creative personality types. Each user receives a personalized digital ID with their personality type, custom sigil, and personal information.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## ✨ Features

- 🧠 **Interactive Personality Quiz** - 10 comprehensive questions to determine your creative type
- 🎨 **6 Unique Personality Types** - Each with custom sigils and descriptions:
  - The Architect (methodical & strategic)
  - The Visionary (innovative & intuitive)
  - The Artisan (practical & skillful)
  - The Catalyst (energetic & inspiring)
  - The Harmonizer (empathetic & collaborative)
  - The Innovator (tech-savvy & problem-solving)
- 📸 **Webcam Selfie Capture** - Take your photo directly in the app
- 🆔 **Beautiful Digital ID Cards** - Professional ID design with all your info
- ⬇️ **Download as PNG** - Export your Digital ID as high-quality image
- 🔗 **Shareable Links** - Generate read-only public links to share your ID
- 🌓 **Dark/Light Mode** - Automatic theme support
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 💾 **Optional Database** - Works with or without Supabase

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database**: Supabase (optional - app works without it!)
- **Language**: TypeScript
- **Image Capture**: HTML5 getUserMedia API
- **Export**: html2canvas
- **Deployment**: Vercel (free tier compatible)

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Modern web browser with camera support

## 🛠️ Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository (or download ZIP)
git clone <your-repo-url>
cd personality-stamp

# Install dependencies
npm install
```

### 2. Environment Variables (Optional)

The app works **without** Supabase using localStorage. If you want database persistence:

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**To set up Supabase:**

1. Create a free account at [https://supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy the Project URL and anon/public key
5. Run the SQL in `supabase-setup.sql` in the SQL Editor
6. Create a storage bucket named `selfies` (make it public)

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser 🎉

## 🌐 Deployment to Vercel (FREE!)

### Method 1: GitHub (Recommended)

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [https://vercel.com](https://vercel.com) and sign in with GitHub

3. Click **"New Project"** → **"Import"** your repository

4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: ./
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)

5. **Add Environment Variables** (if using Supabase):
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `NEXT_PUBLIC_SUPABASE_ANON_KEY`

6. Click **"Deploy"** 🚀

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow the prompts
```

### Important Notes for Vercel

✅ **Free Tier Compatible** - This app works perfectly on Vercel's free tier
✅ **No Serverless Functions** - Pure client-side app (except Next.js API routes if added)
✅ **Auto SSL** - Vercel provides HTTPS automatically
✅ **Camera Permissions** - HTTPS is required for camera access (Vercel provides this)

## 📁 Project Structure

```
personality-stamp/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home/landing page
│   ├── globals.css             # Global styles & Tailwind
│   ├── personal-info/
│   │   └── page.tsx            # Personal information form
│   ├── personality-test/
│   │   └── page.tsx            # Quiz with 10 questions
│   ├── digital-id/
│   │   └── page.tsx            # Digital ID card with selfie
│   └── share/[userId]/
│       └── page.tsx            # Public shareable ID view
├── lib/
│   └── supabase.ts             # Supabase client config
├── types/
│   └── index.ts                # TypeScript interfaces
├── public/                     # Static assets
├── supabase-setup.sql          # Database schema (optional)
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## 🎯 User Flow

1. **Home Page** → Click "Get Your Personality Stamp"
2. **Personal Info** → Fill in name, DOB, nationality, sex, species
3. **Personality Test** → Answer 10 questions
4. **Results** → See your personality type and sigil
5. **Digital ID** → Take selfie, view ID card, download as PNG, copy share link
6. **Share** → Anyone can view your ID at `/share/[userId]` (read-only)

## 🔧 Customization

### Add More Personality Types

Edit `app/personality-test/page.tsx`:

```typescript
const personalityTypes = [
  {
    id: 'your-type',
    name: 'Your Type Name',
    description: 'Description...',
    traits: ['Trait1', 'Trait2'],
    sigil: 'your-sigil-id'
  }
]
```

### Modify Questions

Edit the `questions` array in `app/personality-test/page.tsx`

### Change Colors/Themes

Edit `tailwind.config.ts` and `app/globals.css`

## 🐛 Troubleshooting

**Camera not working?**
- Ensure you're using HTTPS (required for getUserMedia)
- Check browser permissions
- Vercel deployments have HTTPS by default

**Supabase errors?**
- App falls back to localStorage automatically
- Check your environment variables
- Ensure SQL schema is set up correctly

**Build errors on Vercel?**
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs in Vercel dashboard

## 📝 License

MIT - Feel free to use for personal or commercial projects!

## 🙏 Credits

Built with ❤️ using Next.js, Tailwind CSS, and Supabase

---

**Ready to discover your personality stamp?** 🎭✨
