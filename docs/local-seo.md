# Local SEO — being found near the gym

Started 2026-10-07. Goal: when someone near Manamaiju searches "Three Star Gym", "gym near me" or "gym in
Manamaiju", they see Three Star Gym, its map listing, its reviews and a link to
<https://threestargym.vercel.app>.

**The short answer:** for local searches, the **Google Business Profile** (the map listing with photos,
hours, reviews and a Website button) matters more than the website itself. Google shows local results based
on where the searcher is, so a strong profile near the gym beats a gym with a better website further away.
The website supports the profile: it confirms the details, gives Google content to rank, and turns visitors
into enquiries.

Nobody can guarantee position one. But a gym's own name is a search with little competition: with a
verified profile and an indexed site, "Three Star Gym" near Manamaiju should show this gym within a few
weeks. Generic searches ("gym near me") depend mostly on distance, reviews and how complete the profile is.

## How Google picks local results

Google says local results depend on three things
([Google Business Profile help](https://support.google.com/business/answer/7091)):

| Factor | What it means | What moves it |
| --- | --- | --- |
| Relevance | Does the listing match what was searched? | Correct category ("Gym"), full description, services, website content that names the area |
| Distance | How far the gym is from the searcher | Exact pin on the map; can't be changed, which is why nearby customers are the ones we can win |
| Prominence | How well known and trusted the gym is | Number and quality of reviews, replies to reviews, links and mentions on other sites, photos, activity |

The website affects relevance and prominence. The profile affects all three.

## Status

| Area | Owner | Status |
| --- | --- | --- |
| 1. Google Business Profile | Gym owner (you help) | Not started |
| 2. Google Search Console | You | Not started |
| 3. Website changes | Developer (Claude) | Not started |
| 4. Same details everywhere | Gym owner and you | Not started |
| 5. Reviews | Gym owner and staff | Ongoing |
| 6. Custom domain | Gym owner and you | Later |

## 1. Google Business Profile (most important)

First check whether a profile for Three Star Gym already exists: search the name on Google Maps. If one
exists, the owner claims it ("Own this business?"). If not, create one at
<https://business.google.com>.

- [ ] Profile created or claimed by the gym owner's Google account (add yourself as a manager, not the owner)
- [ ] Verified. Google asks for a video of the gym, a postcard or a phone call; budget a few days
- [ ] Name exactly "Three Star Gym". No extra keywords like "Best Gym Kathmandu": Google suspends profiles
      for that
- [ ] Primary category **Gym**; extra categories only if true (e.g. "Personal trainer", "Fitness center")
- [ ] Pin placed exactly on the building at Loktantrik Chowk, Manamaiju
- [ ] Address written the same way as on the website (see section 4)
- [ ] Phone number and opening hours, including Saturday and festival hours (Dashain, Tihar)
- [ ] Website set to `https://threestargym.vercel.app`
- [ ] Description (up to 750 characters) that naturally says what the gym offers and where
- [ ] Services listed with short descriptions, matching the website's services
- [ ] At least 10 real photos: outside (so people can find the entrance), training floor, equipment,
      coaches, a class. Add new ones every month
- [ ] A post every week or two (offer, new class, holiday hours)
- [ ] Messaging or WhatsApp link turned on if the owner will answer

## 2. Google Search Console

Search Console tells Google the site exists, shows which searches find it, and reports problems.

- [ ] Add the property at <https://search.google.com/search-console> as a **URL prefix**:
      `https://threestargym.vercel.app` (a Domain property needs DNS access, which `vercel.app` doesn't give)
- [ ] Verify with the **HTML tag** method: send the tag to the developer, it goes in `index.html`
- [ ] Submit `https://threestargym.vercel.app/sitemap.xml`
- [ ] Use **URL inspection → Request indexing** on the homepage, Contact and Membership
- [ ] Check back after 1–2 weeks: Pages report (indexed or not) and Performance report (which searches
      show the site)
- [ ] Redeploy after publishing new blog posts or services so the sitemap picks them up

## 3. Website changes

The basics are already live from Phase 5: unique titles and descriptions, canonical links, sitemap,
robots.txt, share images, and HealthClub structured data with the address on Home and Contact.

To do:

- [ ] Search Console verification tag in `index.html` (after section 2 gives us the tag)
- [ ] Structured data: add map coordinates (`geo`), opening hours in Google's format
      (`openingHoursSpecification`), price range and the profile's Maps link, so the website and the
      profile clearly describe the same place
- [ ] Mention the area naturally where it helps visitors: Contact and footer say "Loktantrik Chowk,
      Manamaiju" and how to get there (landmarks, parking). No keyword stuffing (PRD §28)
- [ ] An About or Contact paragraph naming nearby areas people come from, once the owner confirms which
- [ ] A few blog posts with local angles, e.g. "Training through Kathmandu's monsoon", "Best times to
      train at Three Star Gym"
- [ ] Optional: a "Find us" link to the Google Business Profile on Contact and in the footer, so happy
      members can leave a review in one tap

Not needed for now: server rendering. Google runs the site's JavaScript and reads the rendered page; the
Phase 5 checks confirmed titles, canonicals and structured data are there after rendering. If Search
Console later shows pages not being indexed, revisit this.

## 4. Same details everywhere

Google trusts a business more when its name, address and phone (often called NAP) match everywhere it
appears. Pick one exact version and use it on every site.

| Field | Exact text (confirm with owner) |
| --- | --- |
| Name | Three Star Gym |
| Address | Loktantrik Chowk, Manamaiju, Kathmandu 44600 |
| Phone | Confirm the real number. The live site still shows the placeholder `+977 9800000000`, and the WhatsApp number and social links are placeholders too |
| Website | `https://threestargym.vercel.app` (later the custom domain) |

Places to update:

- [ ] Website: Admin → Settings (name, address, phone, WhatsApp, email, map link, social links)
- [ ] Google Business Profile
- [ ] Facebook page: name, address, phone, website button, category "Gym"
- [ ] Instagram: bio link to the website, address in the contact button
- [ ] TikTok bio link, if used
- [ ] Nepali listings where available (e.g. local business directories, Kathmandu fitness listings)
- [ ] Any existing old listing with a different name or number: fix it or ask for removal

## 5. Reviews

Reviews are the biggest lever for prominence that the gym controls.

- [ ] Get the profile's review link (Business Profile → Ask for reviews) and turn it into a QR code at
      the front desk
- [ ] Coaches ask happy members in person, for example after a first month or a personal best
- [ ] Reply to every review within a few days, good or bad, briefly and politely
- [ ] Never buy reviews or offer rewards for them; Google removes them and can penalise the profile
- [ ] Aim: 20+ reviews in the first three months, then a steady few each month

## 6. Custom domain (later)

A domain like `threestargym.com.np` looks more trustworthy than `vercel.app` and gives full control in
Search Console. `.com.np` domains are free from <https://register.com.np> but need the business
registration documents, so the owner applies. When it's live: add it in Vercel, set `VITE_SITE_URL`,
redeploy, update Supabase Auth URLs, add a Domain property in Search Console, and change the website link on
the Business Profile and social pages.

## What to expect

| When | What should happen |
| --- | --- |
| Week 1 | Profile created and verification requested; Search Console verified; sitemap submitted |
| Weeks 1–2 | Homepage indexed; searching "Three Star Gym Manamaiju" shows the site |
| Weeks 2–4 | Profile verified and showing on Maps; brand searches near the gym show the map listing |
| Months 1–3 | Reviews building up; the gym starts appearing for "gym near me" close to Manamaiju |
| Ongoing | Search Console shows which searches bring visitors; adjust content from that |

## Open questions

- Does a Google Business Profile for the gym already exist, and who owns it?
- Real phone number, WhatsApp number and opening hours
- Which nearby areas do most members come from?
- Is there an existing Facebook page or Instagram account to link?
- Are there other gyms named "Three Star" in Kathmandu that searches could confuse with this one?
