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
| 2. Launch QA pass | Not started |
| 3. Public empty and error states | Not started |
| 4. Click analytics | Not started |
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

- [ ] Screenshots reviewed for every page at every width, issues fixed
- [ ] Zero console errors on public pages
- [ ] Zero broken links
- [ ] Lighthouse mobile scores and Core Web Vitals recorded below, targets met
- [ ] Definition of Done (§53, public website) all true

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | --- | --- | --- | --- | --- | --- |
| Home | | | | | | |
| Service | | | | | | |
| Blog post | | | | | | |

## Step 3 — Public empty and error states

Every public page should still read well when the gym hasn't published anything yet, and a failed data load
should show a friendly retry instead of a blank page (PRD §42: "Do not leave blank screens").

**Empty content to check**

| Page or section | Nothing published | Plan |
| --- | --- | --- |
| Home sections (services, trainers, plans, testimonials, transformations, gallery, FAQ) | To check | Hide the section cleanly, with no leftover heading or gap |
| Services page | To check | Short message and a link to contact |
| Trainers page | To check | Short message |
| Membership page | To check | "Ask us for prices" with call and WhatsApp |
| Gallery page | To check | Short message and an Instagram link if set |
| Blog page | To check | "First articles coming soon" |
| FAQ page | To check | Link to contact |
| Free trial form (no plans) | To check | Form still works without a plan picker |
| Unpublished slug (service, trainer, post) | Shows 404 | Keep, check the copy |

**Errors to handle**

- Supabase unreachable or slow on first load (the root loader fails): friendly page with a Retry button,
  the gym's phone number and WhatsApp, so a visitor can still make contact
- A lazy page chunk fails to load after a new deploy: reload once automatically, then show the retry page
- Malformed CMS content (already parsed with `parseOrNull`): the section is skipped, never a crash

**How to test:** a local Supabase with everything unpublished, plus a blocked network request to simulate
an outage.

**Done when**

- [ ] Every row in the table above checked and handled
- [ ] Outage and failed-chunk cases show the retry page with contact details
- [ ] No blank screens anywhere

## Step 4 — Click analytics

Count the actions that matter to the gym owner (PRD §44), so they can see which pages and buttons bring in
members.

**Events**

| Event | Fired when |
| --- | --- |
| `page_view` | Any public page loads (automatic) |
| `cta_click` | A primary CTA is clicked, tagged with its label and page |
| `free_trial_started` | The free trial page opens |
| `membership_viewed` | The membership page opens |
| `enquiry_submitted` | An enquiry is saved, tagged with its source |
| `phone_clicked` | A `tel:` link is clicked |
| `whatsapp_clicked` | A WhatsApp link is clicked |
| `directions_clicked` | The map or directions link is clicked |
| `blog_view` | A blog post opens, tagged with its slug |

**Provider (proposed):** Vercel Web Analytics. It's built into the host, uses no cookies (so no consent
banner), and its free tier should cover a local gym's traffic. Custom events need checking against the free
plan before we commit; the alternative is a free self-hosted option such as Umami.

**Rules:** one small `track()` helper so the provider can be swapped later; no personal data in events
(no names, phone numbers or emails); admin pages are never tracked.

**Done when**

- [ ] Provider chosen and recorded in the decisions log
- [ ] All events above fire on the live site and show in the dashboard
- [ ] Public JS cost of the script recorded
- [ ] The owner knows where to see the numbers

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

- Does the gym owner want click analytics at all? (Step 4)
- Real brand colour and logo: does the gym have them, or do we design the Three Star mark?
- When will real photos of the gym be available?
- Custom domain (`.com.np` needs the owner's business documents)

**Decisions log** (newest first)

| Date | Decision |
| --- | --- |
| 2026-10-07 | Hero video hosted on Vercel in `public/hero/`, not Supabase (5 GB/month download limit) |
| 2026-10-07 | Phones get a lighter portrait clip; Data Saver and reduced motion get the photo only |
| 2026-10-07 | Page transitions enabled globally in the router instead of per link |
| 2026-10-07 | Phase 6 runs the four steps in order: transitions, QA, empty and error states, analytics |
| 2026-10-07 | Site moved to `threestargym.vercel.app`; gym renamed to "Three Star Gym" |
