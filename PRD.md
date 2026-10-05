Yes. I looked through the current Gold’s Gym Nepal site, including the homepage, services, membership, trainers, FAQ, blog, and contact flow. The important thing is **not to clone it**—use it as the baseline for what a local gym needs, then make your version feel much more premium, editorial, animated, and conversion-focused.

Gold’s Gym currently covers the expected gym-site sections: services/facilities, trainers, memberships, testimonials, FAQs, free-trial CTA, blog, and contact/enquiry forms. ([Gold's Gym][1])

I’d make your project more ambitious technically too: **the public website should feel like a premium landing page, while Supabase + the admin dashboard quietly turns it into a proper small CMS/CRM.**

Below is the PRD I'd give Claude.

---

# Gym Website — Product Requirements Document

## 1. Product Overview

Build a **premium, highly visual website for a local gym in Nepal**.

The website should position the gym as a modern, serious fitness destination rather than looking like a generic WordPress gym template.

The primary goal is **conversion**:

> Visitor → Interested → Enquiry / Free Trial → Gym Visit → Membership

The secondary goal is to give the gym owner a simple backend where they can manage the website without needing a developer.

### Core stack

* **Frontend:** React + TypeScript
* **Build:** Vite
* **Styling:** Tailwind CSS
* **Animation:** GSAP + ScrollTrigger
* **UI:** shadcn/ui where appropriate
* **Icons:** Lucide React
* **Backend:** Supabase
* **Database:** PostgreSQL via Supabase
* **Storage:** Supabase Storage
* **Authentication:** Supabase Auth
* **Deployment:** Vercel
* **Forms:** React Hook Form + Zod
* **Maps:** Google Maps embed/link initially
* **Analytics:** Vercel Analytics + optional Google Analytics
* **SEO:** React Helmet/appropriate SEO solution
* **Image optimization:** modern responsive image formats and lazy loading

Do not over-engineer the initial version.

---

# 2. Product Philosophy

The website should feel:

* Premium
* Strong
* Modern
* Athletic
* Minimal
* Confident
* Energetic
* Local but not cheap
* Visually impressive

Avoid:

* Generic Bootstrap-style layouts
* Excessive cards
* Too many rounded containers
* Huge amounts of text
* Stock-photo-looking imagery
* Excessive gradients
* Random animations everywhere
* Slow loading caused by animations
* Template-looking sections

### Design principle

**Photography + typography + whitespace + motion should do most of the visual work.**

The website should look impressive even before the user reads the content.

---

# 3. Target Audience

Primary:

* 18–35 year-olds
* Students
* Young professionals
* People interested in muscle building
* People trying to lose fat
* Beginners looking for guidance
* Existing gym-goers looking for a better facility

Secondary:

* Older adults interested in health
* Women looking for a comfortable fitness environment
* Personal-training clients
* People searching Google for gyms nearby

---

# 4. Primary Conversion Goals

Every major page should ultimately lead toward one of these actions:

### Primary CTA

**Start Your Fitness Journey**

### Secondary CTAs

* Get Free Trial
* View Memberships
* Contact Us
* Call Now
* WhatsApp Us
* Get Directions
* Meet Our Trainers
* Ask a Question

The website should make contacting the gym extremely easy.

---

# 5. Site Architecture

```text
/
├── Home
├── About
├── Membership
├── Services
│   ├── Personal Training
│   ├── Strength Training
│   ├── Cardio
│   ├── Group Classes
│   ├── Nutrition
│   └── Other services
├── Trainers
├── Gallery
├── Blog
│   └── Blog Article
├── FAQ
├── Contact
├── Free Trial
│
└── Admin
    ├── Dashboard
    ├── Enquiries
    ├── Blog
    ├── FAQs
    ├── Trainers
    ├── Services
    ├── Memberships
    ├── Testimonials
    ├── Gallery
    ├── Homepage Content
    ├── Site Settings
    └── Admin Users
```

---

# 6. Homepage

This is the **most important page**.

It should feel more like a premium fitness campaign than a traditional business website.

## Section 1 — Hero

Full viewport.

Large gym photography/video.

Possible structure:

```text
[GYM LOGO]

BUILD
YOUR
STRONGEST
SELF.

Train with purpose.
Build strength. Build confidence.

[ START YOUR JOURNEY ]
[ EXPLORE MEMBERSHIPS ]
```

Possible background:

* Full-screen gym video
* Training footage
* Slow-motion athlete footage
* Gym environment

### Hero animation

Use GSAP.

On page load:

1. Logo fades/slides in
2. Main headline reveals line-by-line
3. Supporting text appears
4. CTA buttons appear
5. Background media subtly scales from ~1.05 → 1

Do not make the animation slow.

---

# 7. Sticky Navigation

Desktop:

```text
LOGO

About
Services
Membership
Trainers
Blog

[JOIN NOW]
```

Navigation behavior:

* Transparent over hero
* Becomes solid/blurred after scrolling
* Smooth transition
* Mobile hamburger menu
* Mobile menu should feel premium, not like default drawer UI

Optional:

```text
Call
WhatsApp
```

on mobile.

---

# 8. Social Proof / Stats Strip

Immediately after hero.

Example:

```text
10+
Years Experience

500+
Members

8+
Expert Trainers

4.9/5
Member Rating
```

These values must be CMS-editable.

Admin should be able to modify:

* Number
* Label
* Description

---

# 9. Brand Introduction

Editorial-style section.

Large heading:

> MORE THAN A GYM.

Then a short paragraph explaining the gym philosophy.

Use:

* Large typography
* Image composition
* Asymmetrical layout
* Scroll-triggered animation

Possible interaction:

Image moves subtly horizontally while text reveals.

---

# 10. Services / Training

Display major offerings.

Example:

```text
WHAT WE DO

01 — Strength Training
02 — Personal Training
03 — Cardio
04 — Group Classes
05 — Nutrition
06 — Functional Training
```

Instead of generic cards, experiment with **large horizontal rows**.

Hover:

* Background image appears
* Number shifts
* Arrow appears
* Row expands slightly

Mobile:

Stack vertically.

All services should be CMS-managed.

---

# 11. Why Choose Us

Create 3–5 strong differentiators.

Example:

### Expert Trainers

Experienced trainers who actually guide members.

### Premium Equipment

Modern equipment for strength and conditioning.

### Clean Environment

Clean, organized and comfortable training environment.

### Results-Focused

Training designed around actual goals.

### Community

A gym where members feel welcome.

These should be editable from admin.

---

# 12. Transformation / Results Section

If the gym has real member transformations, this should become one of the strongest sections.

Display:

```text
REAL PEOPLE.
REAL WORK.

[before] → [after]
```

Admin should be able to add:

* Person name
* Before image
* After image
* Duration
* Goal
* Result
* Testimonial

Example:

```text
12 WEEKS

-8 KG

"Finally found a routine I could stick to."

— Member Name
```

Do not fabricate results.

If there are no transformations initially, hide this section.

---

# 13. Trainers

Large visual section.

Each trainer:

* Photo
* Name
* Position
* Years of experience
* Specialization
* Short bio
* Certifications
* Social links if applicable

Clicking a trainer can open a detailed profile.

Admin CRUD required.

---

# 14. Membership

This is a major conversion section.

Display membership options clearly.

Example:

```text
MONTHLY
NPR XXXX

QUARTERLY
NPR XXXX

HALF YEAR
NPR XXXX

YEARLY
NPR XXXX
```

Each plan:

* Name
* Price
* Duration
* Features
* CTA

Admin should be able to:

* Create
* Edit
* Delete
* Reorder
* Mark as popular
* Enable/disable
* Change price
* Change features

Do not hardcode pricing into React.

---

# 15. Free Trial CTA

Large visual conversion section.

Example:

> YOUR FIRST WORKOUT STARTS HERE.

> Come experience the gym before you commit.

```text
[ BOOK A FREE TRIAL ]
```

Clicking opens enquiry form/modal.

---

# 16. Gallery

Use real gym photography.

Possible layout:

Masonry / asymmetric grid.

Categories:

* Gym
* Equipment
* Training
* Members
* Events
* Facilities

Admin can upload images.

Required:

* Image
* Alt text
* Category
* Caption
* Sort order
* Published status

Use Supabase Storage.

---

# 17. Testimonials

Display actual member reviews.

Each:

* Name
* Photo optional
* Rating
* Testimonial
* Date
* Source

Optional:

```text
Google
Facebook
Website
```

Admin controls testimonials.

Do not fabricate testimonials.

---

# 18. FAQ

Accordion section.

Questions should be CMS controlled.

Example:

* What are your membership prices?
* Do you offer free trials?
* Are beginners welcome?
* Do you provide personal training?
* What are your opening hours?
* Do you offer student discounts?
* Do you have parking?
* What equipment do you have?
* Do you provide diet plans?

Admin CRUD:

```text
Question
Answer
Category
Order
Published
```

FAQ should also be structured for SEO using FAQ structured data where appropriate.

---

# 19. Blog

Create a proper lightweight CMS.

Blog listing:

```text
LATEST FROM THE GYM

[featured article]

[article]
[article]
[article]
```

Categories:

* Fitness
* Nutrition
* Training
* Lifestyle
* Gym News
* Beginner Guides

Each article:

```text
Title
Slug
Excerpt
Cover Image
Content
Author
Category
Tags
Published Date
SEO Title
SEO Description
```

Admin functionality:

* Create article
* Edit
* Delete
* Draft
* Publish
* Schedule optional
* Feature article
* Upload cover image
* Preview
* SEO fields

A simple Markdown/editor solution is acceptable.

Do **not** build a giant WordPress clone.

---

# 20. Contact / Enquiry System

This is one of the most important backend features.

Public forms should create an enquiry in Supabase.

### Enquiry fields

```text
id
name
email
phone
subject
message
source
status
created_at
updated_at
notes
assigned_to
```

Possible sources:

```text
Contact Form
Free Trial
Membership
WhatsApp
Website
```

Status:

```text
New
Contacted
Interested
Follow-up
Converted
Closed
Spam
```

---

# 21. Admin Enquiry Dashboard

Admin should be able to see:

```text
ENQUIRIES

12 New
5 Follow-up
3 Interested
28 Closed
```

Table:

| Name | Phone | Source | Status | Date |
| ---- | ----- | ------ | ------ | ---- |

Click enquiry:

```text
Name
Phone
Email
Message

Source
Created
Status

Notes

[Mark Contacted]
[Interested]
[Converted]
[Close]
```

### Important

Phone numbers should have a quick action:

```text
Call
WhatsApp
```

on supported devices.

Admin should be able to add internal notes.

---

# 22. Admin Dashboard

The dashboard should provide an overview.

Example:

```text
Good morning.

Overview

New Enquiries       12
This Month          48
Trial Requests      17
Published Blogs      8

Recent Enquiries
-------------------------
...
```

Optional charts:

* Enquiries over time
* Enquiries by source
* Conversion status

Keep this simple.

---

# 23. Homepage CMS

The owner should not need a developer to change common content.

Admin should be able to modify:

### Hero

* Heading
* Subtitle
* CTA text
* CTA link
* Background image/video

### Stats

* Value
* Label

### About

* Heading
* Description
* Image

### Why Us

* Title
* Description
* Icon/image

### CTA

* Heading
* Description
* Button

### Contact

* Phone
* Email
* Address
* Opening hours
* Google Maps URL

---

# 24. Site Settings

Central settings table.

```text
Gym Name
Logo
Favicon
Phone
Email
WhatsApp
Address
Google Maps URL
Instagram
Facebook
TikTok
Opening Hours
Google Business URL
```

Admin can modify these.

The frontend should pull them dynamically.

---

# 25. Admin Authentication

Use Supabase Auth.

Initially:

```text
Admin Login
Email
Password
```

Potential future roles:

```text
Super Admin
Manager
Content Editor
```

For V1, a single admin role is enough.

Use Supabase Row Level Security aggressively.

**Never expose service-role keys in the frontend.**

---

# 26. Suggested Database Schema

Core tables:

```text
admins
site_settings
homepage_sections

enquiries
enquiry_notes

membership_plans

services
trainers

testimonials
transformations

gallery_images

faqs

blog_posts
blog_categories

contact_submissions
```

Potential additional:

```text
leads
newsletter_subscribers
```

but these are optional for V1.

---

# 27. Supabase Storage

Buckets:

```text
gym-assets
blog-images
trainer-images
gallery
transformations
```

Images should be optimized before upload where possible.

Store only metadata in PostgreSQL.

---

# 28. SEO

Every public page should have:

* Unique title
* Meta description
* Canonical URL
* OpenGraph image
* OpenGraph title
* OpenGraph description

Blog posts should generate their own SEO metadata.

Structured data:

* LocalBusiness
* Organization
* Article
* FAQPage where appropriate

Important local SEO terms should naturally target:

```text
gym in [city]
best gym in [city]
fitness center in [city]
personal training in [city]
gym near [area]
```

Do not keyword-stuff.

---

# 29. Performance

This is critical.

Heavy UI does **not** mean heavy website.

Target:

```text
LCP < 2.5s
CLS < 0.1
INP < 200ms
```

Use:

* WebP/AVIF
* Lazy loading
* Responsive images
* Proper image sizing
* Preload only critical hero media
* Code splitting
* Dynamic imports for admin
* Avoid loading GSAP plugins unnecessarily
* Avoid huge videos
* Compress videos
* IntersectionObserver/ScrollTrigger carefully

Animations should never destroy mobile performance.

---

# 30. GSAP Animation System

Create reusable animation utilities.

Examples:

```text
fadeUp()
revealText()
imageReveal()
staggerChildren()
parallaxImage()
horizontalScroll()
```

Do not write random GSAP timelines throughout components.

Create an animation system.

Example:

```text
animations/
├── reveal.ts
├── parallax.ts
├── stagger.ts
└── pageTransitions.ts
```

Respect:

```css
prefers-reduced-motion
```

Users who disable motion should receive a clean static experience.

---

# 31. Page Transitions

Optional but desirable.

Use subtle transitions between:

```text
Home → About
Home → Services
Blog → Article
```

Do not make transitions slow or gimmicky.

---

# 32. Mobile UX

Mobile is extremely important.

Navigation:

```text
LOGO                         MENU
```

Sticky bottom CTA could be considered:

```text
[ CALL ] [ WHATSAPP ] [ JOIN ]
```

This is especially useful for a local business.

Forms should be extremely easy to complete on mobile.

---

# 33. WhatsApp Integration

Since this is Nepal/local business oriented, WhatsApp should be prominent if the gym uses it.

Example:

```text
Chat with us
```

Generate a WhatsApp link containing a prefilled message:

> Hi, I found your gym through your website and would like to know about membership plans.

Admin controls WhatsApp number.

---

# 34. Enquiry Notifications

When a new enquiry is submitted:

1. Save to Supabase.
2. Show success state.
3. Optionally send email notification.
4. Optionally notify WhatsApp/Telegram later.

V1 can initially use email notification or simply the admin dashboard.

Do not make external notification infrastructure a blocker for launch.

---

# 35. Contact Page

Include:

```text
Address
Phone
Email
Opening Hours
Google Maps
WhatsApp
Social Links
```

Plus contact form.

Large visual image of gym/location.

---

# 36. About Page

Sections:

```text
Hero
Our Story
Our Philosophy
Why We Exist
Facilities
Trainers
Community
CTA
```

Avoid making it a wall of text.

---

# 37. Services Page

Service detail pages should be dynamically generated from the CMS.

Example:

```text
/services/personal-training
/services/strength-training
/services/cardio
```

Each service:

```text
Hero image
Title
Short description
Benefits
Who it's for
What to expect
CTA
Related services
```

---

# 38. Admin Content Ordering

Where appropriate, admin should have:

```text
↑ Move Up
↓ Move Down
```

or drag-and-drop ordering.

Especially for:

* Services
* Trainers
* FAQs
* Testimonials
* Gallery
* Memberships

---

# 39. Publishing Model

Content should have:

```text
draft
published
archived
```

Blog posts should support draft/publish.

Other content can use:

```text
published: boolean
```

---

# 40. Security

Supabase RLS policies are mandatory.

Public users:

```text
READ published content
CREATE enquiries
```

Admins:

```text
CRUD content
READ enquiries
UPDATE enquiries
```

Public users must never be able to:

```text
read enquiries
read admin data
modify published content
access private storage
```

Validate all forms using Zod.

Never trust frontend validation alone.

---

# 41. Admin UX

Admin panel does **not** need to be beautiful like the public website.

It needs to be:

* Fast
* Simple
* Clear
* Desktop-friendly
* Mobile usable
* Hard to mess up

Sidebar:

```text
Dashboard

CONTENT
Homepage
Services
Trainers
Memberships
FAQs
Testimonials
Gallery
Blog

LEADS
Enquiries

SETTINGS
Site Settings
Admin
```

---

# 42. Error / Loading States

Every async operation needs:

* Loading state
* Empty state
* Error state
* Success feedback

Example:

```text
No enquiries yet.

When someone contacts the gym,
their enquiry will appear here.
```

Do not leave blank screens.

---

# 43. Forms

All public forms need:

* Client validation
* Server/database validation
* Loading state
* Success message
* Error message
* Spam protection

Potentially use a honeypot field initially.

Later:

* Cloudflare Turnstile

---

# 44. Analytics

Track:

```text
page_view
cta_click
free_trial_started
membership_viewed
enquiry_submitted
phone_clicked
whatsapp_clicked
directions_clicked
blog_view
```

This gives the owner useful business information.

---

# 45. Admin Dashboard Analytics

Eventually show:

```text
Website Performance

Visitors
Enquiries
Free Trial Requests
Phone Clicks
WhatsApp Clicks
```

V1 can keep this minimal.

---

# 46. Content Strategy

The website should prioritize **real gym assets**.

Before final design, collect:

* Gym exterior
* Reception
* Equipment
* Strength training
* Cardio
* Group classes
* Trainers
* Members
* Training sessions
* Locker/changing facilities
* Transformation photos
* Gym atmosphere
* Logo
* Brand colors

Real photography will make the site significantly better than generic gym websites.

---

# 47. Visual Direction

### Typography

Use a strong modern display font for headlines.

Potential pairing:

```text
Display:
Bebas Neue / Oswald / Anton / Archivo Black

Body:
Inter / Manrope / DM Sans
```

Choose **one display + one body font**.

Do not use five fonts.

---

# 48. Color System

Default direction:

```text
Background: near-black / charcoal
Primary: white
Accent: gym-specific color
Muted: gray
```

But do not blindly use black/red.

The actual gym's branding should determine the accent.

Build the design system using CSS variables so colors can easily change.

---

# 49. Component Architecture

Suggested structure:

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── hero/
│   ├── sections/
│   ├── cards/
│   ├── forms/
│   └── animations/
│
├── pages/
│   ├── Home/
│   ├── About/
│   ├── Services/
│   ├── Membership/
│   ├── Trainers/
│   ├── Gallery/
│   ├── Blog/
│   ├── FAQ/
│   └── Contact/
│
├── admin/
│   ├── dashboard/
│   ├── enquiries/
│   ├── blog/
│   ├── services/
│   ├── trainers/
│   ├── memberships/
│   ├── faqs/
│   ├── gallery/
│   └── settings/
│
├── lib/
│   ├── supabase.ts
│   ├── validation.ts
│   └── analytics.ts
│
├── hooks/
├── types/
├── utils/
└── styles/
```

Keep business logic separate from UI.

---

# 50. Environment Variables

Example:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never expose:

```env
SUPABASE_SERVICE_ROLE_KEY
```

to the client.

If server-side functionality is needed, use Vercel server functions/API routes or Supabase Edge Functions.

---

# 51. MVP Scope

The first production version should include:

### Public

* Homepage
* About
* Services
* Membership
* Trainers
* Gallery
* Blog
* FAQ
* Contact
* Free Trial form
* WhatsApp CTA
* Google Maps
* Responsive design
* SEO
* GSAP animations

### Admin

* Login
* Dashboard
* Enquiries
* Homepage content
* Services
* Memberships
* Trainers
* FAQs
* Testimonials
* Gallery
* Blog
* Site settings

That is enough to make this a **real product**, not just a portfolio landing page.

---

# 52. Phase 2

After launch:

* Google Reviews integration
* Advanced analytics
* Email marketing
* Newsletter
* Automated enquiry emails
* WhatsApp notifications
* Membership registration
* Online payment
* Member portal
* Trainer schedules
* Class schedules
* Booking system
* QR check-in
* Referral system

Do **not** build these now.

---

# 53. Definition of Done

The project is ready for the gym owner when:

### Public website

* Looks premium on desktop
* Looks excellent on mobile
* Fast initial load
* All CTAs work
* Forms work
* No console errors
* No broken links
* SEO metadata exists
* Images are optimized
* Animations are smooth
* Reduced-motion support exists

### Backend

* Supabase connected
* RLS configured
* Admin authentication works
* Enquiries are stored
* Admin can manage enquiries
* Admin can manage FAQs
* Admin can manage blogs
* Admin can manage trainers
* Admin can manage memberships
* Admin can manage services
* Admin can manage gallery
* Admin can change site settings

### Deployment

```text
GitHub
   ↓
Vercel
   ↓
React application

Supabase
   ↓
Postgres
   ↓
Storage
   ↓
Auth
```

---

# 54. Development Strategy

Do **not** ask Claude to build the entire application in one prompt.

Build in vertical slices.

### Phase 1 — Foundation

```text
React + TS
Tailwind
routing
Supabase
design system
fonts
navigation
responsive shell
```

### Phase 2 — Hero + Homepage

Build the homepage until it already looks impressive.

### Phase 3 — Public CMS content

Connect:

```text
services
trainers
memberships
FAQs
testimonials
gallery
```

### Phase 4 — Enquiries

Build:

```text
forms → Supabase → admin dashboard
```

### Phase 5 — Blog CMS

### Phase 6 — Admin

### Phase 7 — SEO/performance

### Phase 8 — Deployment

### Phase 9 — Polish

Only after functionality works:

```text
micro animations
hover states
page transitions
mobile polish
loading states
empty states
```

---

# 55. Claude Code Rules

Give Claude these rules throughout development:

```text
1. Do not rewrite working code unnecessarily.

2. Before implementing a feature, inspect the existing architecture.

3. Reuse existing components and utilities.

4. Do not introduce a dependency unless there is a clear reason.

5. Keep components reasonably small.

6. Keep Supabase queries separate from presentation components.

7. Use TypeScript strictly. Avoid `any`.

8. Validate all external/user input.

9. Never expose Supabase service-role keys.

10. Implement RLS for every Supabase table.

11. Make all public content responsive.

12. Test desktop and mobile after major UI changes.

13. Respect prefers-reduced-motion.

14. Do not sacrifice performance for animation.

15. Do not use placeholder lorem ipsum in final UI.

16. Use realistic placeholder gym content until real content is provided.

17. Do not fabricate testimonials, statistics, certifications, or transformation results.

18. Before adding a new library, explain why it is necessary.

19. Keep the admin panel functional rather than visually over-designed.

20. Prioritize the homepage's visual quality above secondary pages.

21. Never hardcode content that the admin is supposed to manage.

22. Use reusable sections and CMS-driven data wherever practical.

23. Do not over-engineer V1.

24. After every major implementation, report:
   - files changed
   - what was implemented
   - what remains
   - how it was tested
```

---

# 56. The Most Important Product Decision

I would **not** make this a normal "gym website with an admin panel."

I'd make it:

> **A premium fitness brand website with a lightweight built-in CMS and lead management system.**

That's a much stronger pitch to the owner.

You're effectively giving them:

```text
Website
+
Lead Generation
+
Enquiry Management
+
Content Management
+
Blog
+
Local SEO
+
Analytics
```

rather than:



