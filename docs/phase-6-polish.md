# Phase 6 — Polish

Started 2026-10-07. Phase 6 is the PRD's last phase ("Polish", §54 Phase 9): four steps done strictly in
order, each approved before the next starts.

Phases 1–5 are done. The site is live at <https://threestargym.vercel.app>, and enquiries and password
reset are confirmed working on it.

1. Page transitions
2. Launch QA pass
3. Public empty and error states
4. Click analytics

Alongside the four steps runs an open-ended track: custom elements and icons that make the site look like
Three Star Gym's own, not a template.

**How we work:** one step at a time, small commits, a short report after each step, and no new step
without approval. Tick the checklists and fill in the decisions log as steps land.

## Status

| Step | Status |
| --- | --- |
| 1. Page transitions | Done (awaiting approval) |
| 2. Launch QA pass | Done (awaiting approval) |
| 3. Public empty and error states | Done (awaiting approval) |
| 4. Click analytics | Built; needs the Umami website ID |
| Making it ours (ongoing) | Hero headline and video done |

## Already in place

These PRD polish items already exist and are not redone in this phase.

| Item | Where it lives |
| --- | --- |
| Reduced-motion support: animations are skipped when the visitor's system asks | `src/animations/useMotion.ts`, `src/animations/gsap.ts` |
| Loading bar between pages, delayed so fast navigations don't flash it | `src/components/layout/NavigationProgress.tsx` |
| Sticky mobile bar: Call, WhatsApp, Join | `src/components/layout/MobileActionBar.tsx` |
| WhatsApp links with a prefilled message, number set in Admin → Settings | `src/lib/contact.ts` |
| Empty states on every admin list | `src/admin/pages/` |
| Enquiry form: validation, honeypot, rate limit, loading, success and error messages | `src/components/forms/EnquiryForm.tsx`, `submit_enquiry()` in Postgres |
| SEO metadata, sitemap, structured data, share image | Phase 5 |

## Step 1 — Page transitions

A quick crossfade (about 200 ms) between public pages, built on the browser's View Transitions API through
React Router, with no animation library added. The PRD asks for transitions that are subtle and never
"slow or gimmicky" (§31).

**Approach**

- Turn on React Router's `viewTransition` for public navigation (nav links, CTA links, cards). React Router
  waits for the next page's data, then swaps pages inside the transition, so the old page stays visible
  until the new one is ready.
- Give the navbar and the mobile action bar their own transition names so they stay put while only the
  page content fades.
- Keep each page's existing GSAP entrance animation; the crossfade only covers the swap.
- Admin pages get no transitions.
- Browsers without View Transitions navigate exactly as they do today.

**Reduced motion:** when the visitor's system asks for reduced motion, the transition animations are
switched off in CSS and pages swap instantly.

**Done when**

- [x] Home → About, Home → Services and Blog → Article fade, with the navbar steady
- [x] Back and forward buttons fade too, and scroll position is restored correctly
- [x] No flash of the old page and no layout jump on mobile
- [x] Reduced motion swaps pages with no animation
- [x] Public JS stays within about 1 KB gzipped of today's 189 KB (189.1 KB)

**Result:** one wrapper around `router.navigate` in `src/app/router.tsx` turns on transitions for every
public navigation, so new links get them automatically. Same-page changes (gallery and blog `?category=`
filters) and the admin don't animate. CSS lives in `src/styles/globals.css`; the header and mobile bar
have their own `view-transition-name`. Checked in a headless browser at 1280 px and 375 px, with and without
reduced motion: a transition on every navigation including back and forward, scroll restored on back, no
console errors.

## Step 2 — Launch QA pass

A page-by-page check of the live site against the PRD's Definition of Done (§53), fixing what it finds.
Each fix is its own small commit.

**Pages:** Home, About, Services, one service, Membership, Trainers, one trainer, Gallery, Blog, one post,
FAQ, Contact, Free trial, 404, plus a quick pass over the admin.

**Viewports:** 375 px (small phone), 430 px (large phone), 768 px (tablet), 1280 px and 1440 px (desktop).

**What to look for**

- Layout: overflow, cramped spacing, text that wraps badly, images cropped wrong, the mobile action bar
  covering content
- Hover and focus states on every link, button and card; visible keyboard focus everywhere
- Console errors and warnings on every page
- Broken links, including footer, social and map links
- Every CTA goes where it says (call, WhatsApp, free trial, directions)
- Image sizes: no oversized downloads on mobile, correct `sizes`, hero preloaded
- Lighthouse on mobile for Home, a service page and a blog post: LCP < 2.5 s, CLS < 0.1, INP < 200 ms
  (PRD §29)
- Basic accessibility: heading order, alt text, colour contrast, form labels

**Tools:** headless browser screenshots at each width, Lighthouse, a link checker over the sitemap.

**Done when**

- [x] Screenshots reviewed for every page at every width, issues fixed
- [x] Zero console errors on public pages
- [x] Zero broken links
- [ ] Lighthouse mobile scores and Core Web Vitals recorded below, targets met (CLS met; LCP not, see
      follow-ups)
- [ ] Definition of Done (§53, public website) all true (pending real content and button contrast)

Lighthouse 13, mobile (simulated slow 4G), on the fixed build, 2026-10-07. Before the fixes, the live site
scored 72–73 performance with LCP 5.0–5.7 s.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 77–80 | 96 | 100 | 100 | 4.4–4.9 s | 0.027 |
| Service | 78–79 | 96 | 100 | 100 | 4.7–4.8 s | 0 |
| Blog post | 76 | 96 | 100 | 100 | 5.2 s | 0 |

**What was checked:** all 25 sitemap pages plus a 404 for console errors and broken links; 14 page types
at 375, 430, 768, 1280 and 1440 px for overflow, tap targets, image sizes and the mobile bar; full-page
screenshots at 390 and 1280 px; keyboard tabbing on Home, Contact and Gallery.

**Fixed**

- GSAP warning on Membership (plans header animated while hidden)
- Small text links ("All services", "More about…", "Get directions"…) now have a 44 px tap area
  (`hit-area` utility)
- Focused form fields show a clear 2 px line
- Blog author link underlined (was colour only)
- Gallery strip `sizes` matched to its layout
- Preconnect to Supabase so data starts loading sooner
- Heavy placeholder photos recompressed (4.6 MB → 2.6 MB in total)

**Follow-ups**

- LCP is still ~4.5–5 s on Lighthouse's slow 4G. First paint waits on 189 KB of JS plus Supabase data.
  Options: a static shell in `index.html` so something paints immediately, loading GSAP after first paint,
  and a 960 px image size (needs re-processing stored images). Real-world 4G/WiFi in Kathmandu is faster
  than this simulation; check Vercel's field data once there is traffic.
- White text on the orange buttons is 3.5:1 (needs 4.5:1). Deferred until the brand colour is decided.
- Placeholder content still live: email `hello@threestarfitness.com.np`, phone and WhatsApp
  `9800000000`, Saturday "Closed", homepage stats ("10+ years", "500+ members", "4.9 Google rating").
  The owner must confirm or replace these, especially the Google rating.
- Lighthouse flags `llms.txt` and `ai-catalog.json` because the SPA returns the homepage for unknown
  paths; harmless.

## Step 3 — Public empty and error states

Every public page should still read well when the gym hasn't published anything yet, and a failed data load
should show a friendly retry instead of a blank page (PRD §42: "Do not leave blank screens").

**Empty content to check**

| Page or section | Nothing published | Plan |
| --- | --- | --- |
| Home sections (services, trainers, plans, testimonials, transformations, gallery, FAQ) | Already hid cleanly | No change |
| Home hero hidden or invalid | Stats slid under the fixed navbar, no `<h1>` | Falls back to a plain header with the gym name and description |
| Services page | Heading, then nothing | "Services coming soon" |
| Trainers page | Heading, then nothing | "Coach profiles coming soon" |
| Membership page | Heading, then nothing | "Ask us about prices" with WhatsApp and Call buttons |
| Gallery page | Small centred line | Same `EmptyState` block as the others |
| Blog page | Small centred line | Same `EmptyState` block as the others |
| FAQ page | Heading, then the contact CTA; empty FAQ schema | "Answers coming soon"; schema skipped when empty |
| Free trial form (no plans) | Works | No change |
| Unpublished slug (service, trainer, post) | Shows 404 | No change |

**Errors to handle**

- Supabase unreachable or slow on first load (the root loader fails): friendly page with a Retry button,
  the gym's phone number and WhatsApp, so a visitor can still make contact
- A lazy page chunk fails to load after a new deploy: reload once automatically, then show the retry page
- Malformed CMS content (already parsed with `parseOrNull`): the section is skipped, never a crash

**How to test:** a local Supabase with everything unpublished, plus a blocked network request to simulate
an outage.

**Done when**

- [x] Every row in the table above checked and handled
- [x] Outage and failed-chunk cases show the retry page with contact details
- [x] No blank screens anywhere

**Result**

- `src/components/content/EmptyState.tsx` is the one empty-state block used on all listing pages.
- **Outage:** the error page now shows within ~1 s (was ~15 s of blank screen, because the PostgREST
  client's own retries stacked with React Query's). It shows the gym name, WhatsApp and Call buttons from a
  build-time snapshot (`scripts/contactFallback.ts` → `__CONTACT_FALLBACK__`). If Supabase is unreachable
  during the build, the page still works without the buttons and the build log warns.
- **Stale chunk after a deploy:** `vite:preloadError` reloads once, straight into the page being opened.
  A 10 s guard stops reload loops; if the chunk is still missing, the error page shows.
- **Malformed content:** the database's check constraints already reject bad image JSON; a hero that
  fails validation is skipped and the fallback header shows.
- Tested in a headless browser against a local database with everything unpublished, with Supabase
  blocked, and with a page chunk returning 404.

## Step 4 — Click analytics

Count the actions that matter to the gym owner (PRD §44), so they can see which pages and buttons bring in
members.

**Provider: Umami Cloud, free Hobby plan.** 100K events a month, 6 months of history, custom events, no
cookies (no consent banner), 2.3 KB script loaded after the page. Vercel Web Analytics was the first
proposal, but its free plan has no custom events (Pro only, about $20/month).

**Events**

| Event | Fired when | Data |
| --- | --- | --- |
| Page view | Any public page loads, including in-site navigation (automatic) | URL |
| `cta_click` | A button-style link (`CtaLink`, mobile bar "Free trial") is clicked | `label`, `page`, `area` |
| `phone_clicked` | Any `tel:` link is clicked | `page`, `area` |
| `whatsapp_clicked` | Any `wa.me` link is clicked | `page`, `area` |
| `directions_clicked` | Any Google Maps link is clicked | `page`, `area` |
| `enquiry_submitted` | An enquiry is saved | `source` (contact, free_trial…) |

`area` is `header`, `footer`, `mobile_bar` or `page`. "Membership viewed", "blog view" and "free trial
started" from the PRD are read from page views of `/membership`, `/blog/*` and `/free-trial` instead of
separate events, to save the monthly allowance.

**How it works:** `src/lib/analytics.ts` loads the script only when `VITE_UMAMI_WEBSITE_ID` is set (Vercel
Production only), locks it to the production domain (`data-domains`), drops anything from `/admin` before it
is sent (`data-before-send`), and uses one document-level click listener, so new phone, WhatsApp, map and
CTA links are counted without extra code. No names, phone numbers or emails are sent.

**Known gap:** visitors using Brave or an ad blocker aren't counted, because those block Umami's script.
Expect the numbers to read somewhat low.

**Done when**

- [x] Provider chosen and recorded in the decisions log
- [ ] All events above fire on the live site and show in the dashboard (verified locally against
      intercepted requests; live check waits for the website ID)
- [x] Public JS cost recorded: +0.5 KB gz in the bundle, plus the 2.3 KB gz Umami script after load
- [ ] The owner knows where to see the numbers (cloud.umami.is login)

## Ongoing — Making it ours

Over time, replace generic pieces with custom elements and icons so the site reads as Three Star Gym's
own. Nothing here blocks the four steps; items are picked up one at a time between or after them.

**Done**

- Hero headline about 40% smaller (`--text-hero`), kept to the left so the background stays visible
- Hero background video: `src/components/media/HeroVideo.tsx`, files in `public/hero/` (desktop 636 KB,
  phone 298 KB, placeholder Pexels clip). Loads after the page, fades in once playing, pauses off screen,
  skipped for Data Saver and reduced motion; the admin hero photo shows first and as the fallback.
  Replace with real footage via `scripts/hero-video.sh`.
- Admin → Homepage → Hero → Background: **Video** or **Photo only** (`background` in the hero content;
  missing means Video). The video files themselves still change only through the script and a redeploy.

**Ideas**

- A Three Star mark (three stars, or a star cut from a weight plate) for the logo, favicon and share image,
  replacing the plain orange square
- A custom icon set for services and facilities (barbell, kettlebell, rope, plate, rack) drawn on one grid,
  replacing the generic Lucide icons on public pages
- Signature dividers or section markers, for example plate-edge or chalk-line motifs
- A custom cursor or hover effect for primary CTAs on desktop, kept subtle
- Real photos and video of the gym replacing the Unsplash and Pexels placeholders
- A short branded loading or 404 illustration

**Rules**

- Icons are inline SVG React components in one folder (e.g. `src/components/icons/`), on a 24 px grid
  with one stroke width, coloured with `currentColor`
- Colours come only from the design tokens in `src/styles/globals.css`
- Each new element must work in reduced motion, at 375 px and with keyboard focus
- No icon fonts and no large icon libraries on public pages; each icon is a few hundred bytes
- Keep the public JS budget: check the gzipped size after each addition

## Open questions and decisions

**Open questions**

- Real brand colour and logo: does the gym have them, or do we design the Three Star mark?
- When will real photos of the gym be available?
- Custom domain (`.com.np` needs the owner's business documents)

**Decisions log** (newest first)

| Date | Decision |
| --- | --- |
| 2026-10-07 | Analytics: Umami Cloud free plan (Vercel free plan has no custom events) |
| 2026-10-07 | Error page contact details come from a build-time snapshot, not live data |
| 2026-10-07 | React Query is the only retry layer for public data (PostgREST client retries off) |
| 2026-10-07 | Orange button contrast (3.5:1) left as is until the real brand colour is decided |
| 2026-10-07 | Hero video hosted on Vercel in `public/hero/`, not Supabase (5 GB/month download limit) |
| 2026-10-07 | Phones get a lighter portrait clip; Data Saver and reduced motion get the photo only |
| 2026-10-07 | Page transitions enabled globally in the router instead of per link |
| 2026-10-07 | Phase 6 runs the four steps in order: transitions, QA, empty and error states, analytics |
| 2026-10-07 | Site moved to `threestargym.vercel.app`; gym renamed to "Three Star Gym" |
