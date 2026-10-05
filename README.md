# Three Star Fitness website

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
(placeholder content). Local Supabase Studio runs at http://127.0.0.1:54323 and
captured auth emails (password resets) at http://127.0.0.1:54324.

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
2. `supabase link --project-ref <ref>` then `supabase db push` to apply migrations.
3. Load the placeholder content once: paste `supabase/seed.sql` into the SQL editor.
4. **Authentication → Sign In / Providers**: turn **off** "Allow new users to sign up";
   keep the Email provider **on**.
5. **Authentication → URL Configuration**: set the Site URL to the live site and add
   `https://<your-domain>/admin/reset-password` to the redirect URLs.
6. Put the project URL and publishable (anon) key in `.env.local` and in Vercel's
   environment variables. Never use the secret / service-role key in the frontend.

## Where things live

```
src/
  app/          router and providers
  api/          public data queries (Supabase → typed content)
  admin/        admin panel (lazy-loaded; never shipped to visitors up front)
  animations/   GSAP setup and reusable motion helpers
  components/   layout, homepage sections, forms, shared UI
  schemas/      Zod schemas shared by the site and the admin
  styles/       Tailwind design tokens (change --color-accent for the brand colour)
supabase/
  migrations/   schema, RLS policies, storage bucket
  seed.sql      placeholder content
  tests/        RLS policy tests
```

Placeholder photos in `public/placeholder/` are temporary Unsplash images.
The default page title and link-preview text live in `index.html`.
