# Three Star Gym website

Public website and admin panel for a local gym. React + TypeScript + Vite,
Tailwind CSS, GSAP, Supabase (Postgres, Auth, Storage), deployed on Vercel.
See `PRD.md` for the product requirements.

## Local development

Needs Node 20+, Docker (or OrbStack) and the [Supabase CLI](https://supabase.com/docs/guides/cli).

```sh
npm install
supabase start                 # local Postgres, Auth and Storage
cp .env.example .env.local     # then paste the URL and publishable key from `supabase status`
npm run dev                    # http://localhost:5173
```

`supabase start` applies `supabase/migrations/` and loads `supabase/seed.sql`
(placeholder content). Local ports use the 553xx range so this project can run alongside
other Supabase projects. Local Supabase Studio runs at http://127.0.0.1:55323 and
captured auth emails (password resets) at http://127.0.0.1:55324.

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Type-check and production build |
| `npm run lint` | ESLint |
| `npm run test:rls` | Resets the **local** database and runs the security policy checks |
| `npm run db:types` | Regenerates `src/types/database.ts` from the local schema |

## Admin accounts

Public sign-up is disabled. To give someone access to `/admin`:

1. Supabase dashboard → **Authentication → Users → Add user** (email + password, auto-confirm).
2. **SQL editor**, run:

   ```sql
   insert into public.admins (user_id, email, display_name)
   select id, email, 'Gym owner' from auth.users where email = 'owner@example.com';
   ```

Removing the row from `public.admins` removes admin access immediately.

## Connecting the hosted Supabase project

1. Create a project at supabase.com (free tier).
2. `supabase login` and `supabase link --project-ref <ref>` (run these in a normal terminal).
3. `supabase db push --include-seed` applies the migrations and loads the placeholder content.
   Use plain `supabase db push` for later migrations so the seed isn't loaded twice.
4. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up";
   keep the Email provider **on**.
5. **Authentication → URL Configuration**: set the Site URL to the live site and add
   `https://<your-domain>/admin/reset-password` to the redirect URLs.
6. Put the project URL and publishable (anon) key in `.env.local` and in Vercel's
   environment variables. Never use the secret / service-role key in the frontend.

## Deploying to Vercel

1. Push the repo to GitHub, then on vercel.com: **Add New → Project**, import it.
   Vercel detects Vite; keep the default build command and `dist` output.
2. **Environment variables** (Production and Preview):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`: same values as `.env.local`.
   - `VITE_SITE_URL`: the public address, e.g. `https://threestargym.com.np`. Optional
     until the custom domain is live; the build falls back to the `*.vercel.app` domain.
3. Deploy. Then in Supabase **Authentication → URL Configuration**, set the Site URL to
   the live address and add `https://<domain>/admin/reset-password` as a redirect URL.
4. After adding a custom domain, set `VITE_SITE_URL` to it and redeploy, so canonical
   links, share previews and the sitemap use the real domain.
5. Submit `https://<domain>/sitemap.xml` in Google Search Console.

`sitemap.xml` and `robots.txt` are generated during the build from published blog posts,
services and trainers, so a new post appears in the sitemap after the next deploy.

## Where things live

```
src/
  app/          router and providers
  api/          public data queries (Supabase → typed content)
  admin/        admin panel (lazy-loaded; never shipped to visitors up front)
  animations/   GSAP setup and reusable motion helpers
  components/   layout, homepage sections, forms, shared UI
  schemas/      Zod (zod/mini) schemas shared by the site and the admin
  styles/       Tailwind design tokens (change --color-accent for the brand colour)
supabase/
  migrations/   schema, RLS policies, storage bucket
  seed.sql      placeholder content
  tests/        RLS policy tests
```

Placeholder photos in `public/placeholder/` are temporary Unsplash images. The hero video in
`public/hero/` is a temporary clip from Pexels (free licence,
<https://www.pexels.com/video/man-lifting-a-barbell-5319746/>). To replace it with real footage, run
`scripts/hero-video.sh <clip.mp4> [start] [length] [mobile-crop-x]` and redeploy; set `heroVideo` in
`src/content/heroVideo.ts` to `null` to show only the hero photo.
The default page title and link-preview text live in `index.html`; the default share
image is `public/og-default.jpg`, made from `scripts/og-image.html`.
