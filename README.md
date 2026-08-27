# FlipTronics

Listing site for laptops, consoles, RAM and SSDs. Buyers browse and filter on-site, then close the deal on WhatsApp.

## Setup

### 1. Supabase (database + admin login)

1. Create a project at supabase.com.
2. Go to **SQL Editor** → paste the contents of `supabase/schema.sql` → Run.
3. Go to **Storage** → create a new bucket named `listing-photos` → make it **public**.
4. Go to **Authentication → Users** → **Add user** → create your own admin login (email + password). This is what you'll use to sign in at `/admin`.
5. Go to **Project Settings → API** → copy the **Project URL** and **anon public** key.

### 2. Local environment

Copy `.env.example` to `.env.local` and fill in the two values from step 1.5:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 3. Run it

```
npm install
npm run dev
```

Visit `http://localhost:3000` for the storefront, `http://localhost:3000/admin` to manage listings.

### 4. Deploy (Vercel)

1. Push this project to a GitHub repo.
2. Import the repo at vercel.com.
3. Add the same two environment variables in Vercel's project settings.
4. Deploy. You'll get a live URL like `fliptronics.vercel.app`.
5. Once you buy a domain, attach it in Vercel's Domains tab.

## Editing the WhatsApp number

It's in one place: `lib/whatsapp.ts`.

## Adding listings

Go to `/admin`, sign in, click **+ Add listing**. Upload photos, fill in specs (comma-separated), price, and condition — it appears on the site immediately.
