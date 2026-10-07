# Remaining work

Updated 2026-10-07. Everything still open after Phase 6, in one place. Phases 1–6 are done and on `main`;
see `docs/phase-6-polish.md` for what was built. Change "To do" to "Done" (with the date) as items land, and
add anything new here.

**Who:** *Dev* = developer (code), *You* = site maintainer (accounts, settings, admin), *Owner* = gym owner
(facts, photos, approvals).

## 1. Making it ours (visual identity)

Custom pieces that make the site look like Three Star Gym's own rather than a template. Pick one at a time;
each goes on its own branch and PR. Rules for all of them are at the end of this section.

| Status | Item | Who | Notes |
| --- | --- | --- | --- |
| Done | Smaller hero headline, background stays visible | Dev | `--text-hero` (2026-10-07) |
| Done | Hero background video, Video / Photo only switch in admin | Dev | Placeholder Pexels clip in `public/hero/` (2026-10-07) |
| To do | Three Star mark for the logo, favicon and share image | Dev + Owner | Replaces the plain orange square; ask the owner if a logo already exists |
| To do | Custom icon set for services and facilities | Dev | Barbell, kettlebell, rope, plate, rack, on one 24 px grid; replaces Lucide icons on public pages |
| To do | Signature section dividers or markers | Dev | e.g. plate-edge or chalk-line motifs |
| To do | Subtle hover effect for primary CTAs on desktop | Dev | Keep it quiet; no custom cursor that hurts usability |
| To do | Branded 404 and loading illustration | Dev | Small inline SVG |
| To do | Real brand colour | Owner | Replaces the placeholder orange `--color-accent`; also fixes button contrast (section 4) |

**Rules**

- Icons are inline SVG React components in one folder (`src/components/icons/`), on a 24 px grid with one
  stroke width, coloured with `currentColor`
- Colours only from the design tokens in `src/styles/globals.css`
- Each new element works with reduced motion, at 375 px and with keyboard focus
- No icon fonts or large icon libraries on public pages; check the gzipped JS size after each addition

## 2. Real content (replace placeholders)

The live site still shows placeholder content. Most of it is changed in the admin, no code needed.

| Status | Item | Who | Where |
| --- | --- | --- | --- |
| To do | Phone, WhatsApp number and message, email | Owner → You | Admin → Settings. Live site shows `9800000000` and `hello@threestarfitness.com.np` |
| To do | Opening hours (Saturday currently "Closed") | Owner → You | Admin → Settings |
| To do | Instagram, Facebook, TikTok links (currently bare instagram.com / facebook.com) | Owner → You | Admin → Settings |
| To do | Homepage stats ("10+ years", "500+ members", "8 coaches", "4.9 Google rating") | Owner → You | Admin → Homepage → Stats. Remove the Google rating unless it's real |
| To do | Membership plans and prices | Owner → You | Admin → Memberships |
| To do | Trainers: names, photos, bios | Owner → You | Admin → Trainers |
| To do | Services copy and photos | Owner → You | Admin → Services |
| To do | Testimonials and transformations (real members, with permission) | Owner → You | Admin |
| To do | Real gym photos (about 20) replacing Unsplash placeholders | Owner + You | Admin → Gallery and each section's image fields |
| To do | Real hero video replacing the Pexels clip | You + Dev | Film 10–15 s, then `scripts/hero-video.sh` and redeploy (README) |
| To do | Static share text in `index.html` and `public/og-default.jpg` match the final name and look | Dev | `scripts/og-image.html` regenerates the image |

## 3. Domain, launch and local SEO

| Status | Item | Who | Notes |
| --- | --- | --- | --- |
| Done | Release setup: Vercel token, two IDs, three GitHub secrets, first release `v1.0.0` (2026-10-07) | You | `docs/releasing.md` |
| To do | Pitch the website to the owner | You | Private notes, kept out of git |
| To do | Claim the Google Business Profile | Owner + You | A "Three Star Gym" pin already shows on Google Maps; `docs/local-seo.md` section 1 |
| To do | Custom domain (`.com` or `.com.np`) | Owner + You | Add in Vercel → Domains |
| To do | Set `VITE_SITE_URL` to the new domain and redeploy | You | Canonical links, sitemap, share previews and analytics follow it |
| To do | Update Supabase Auth Site URL and the reset-password redirect | You | Supabase → Authentication → URL Configuration |
| To do | Google Search Console: verify, submit `sitemap.xml` | You + Dev | Dev adds the verification tag to `index.html`; `docs/local-seo.md` section 2 |
| To do | Website local SEO changes (geo coordinates and opening hours in structured data, area mentions) | Dev | `docs/local-seo.md` section 3 |
| To do | Same name, address and phone everywhere (Google, Facebook, Instagram, directories) | Owner + You | `docs/local-seo.md` section 4 |
| To do | Review QR code at the front desk | Owner + You | `docs/local-seo.md` section 5 |
| To do | Switch on analytics (Umami) | You | After the domain; steps in `docs/phase-6-polish.md` Step 4 |

## 4. Performance and accessibility follow-ups

| Status | Item | Who | Notes |
| --- | --- | --- | --- |
| To do | LCP under 2.5 s on Lighthouse mobile (now ~4.5–5 s) | Dev | Options: static shell in `index.html`, load GSAP after first paint, a 960 px image size. Check real-visitor data first |
| To do | Orange button contrast 3.5:1 → 4.5:1 | Dev | Decide with the real brand colour (section 1) |
| To do | Admin pages wait ~15 s before showing an error during a Supabase outage | Dev | Same stacked retries as the public site had; turn off the full client's retries |
