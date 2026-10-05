-- Placeholder content for local development and first deploy.
-- Generated from the original src/content placeholders. Photos point at
-- /placeholder/* files shipped with the site; replace via the admin panel.
-- Stats, coaches, prices and FAQ answers are EXAMPLES — replace before launch.

insert into public.site_settings (gym_name, short_name, city, area, description, phone, whatsapp_number, whatsapp_message, email, address, google_maps_url, instagram_url, facebook_url, opening_hours) values
  ('Three Star Fitness', 'Three Star', 'Kathmandu', 'Baneshwor', 'Strength training, personal coaching and group classes in Kathmandu. Book a free trial session.', '+977 9800000000', '9779800000000', 'Hi, I found your gym through your website and would like to know about membership plans.', 'hello@threestarfitness.com.np', 'New Baneshwor, Kathmandu 44600', 'https://maps.google.com/?q=New+Baneshwor+Kathmandu', 'https://instagram.com/', 'https://facebook.com/', '[{"days":"Sunday – Friday","hours":"5:00 am – 9:00 pm"},{"days":"Saturday","hours":"7:00 am – 12:00 pm"}]'::jsonb);

insert into public.homepage_sections (key, content) values
  ('hero', '{"heading":"Build your\nstrongest\nself.","subheading":"Train with purpose. Build strength. Build confidence.","primaryCta":{"label":"Start your journey","to":"/free-trial"},"secondaryCta":{"label":"Explore memberships","to":"/membership"},"image":{"src":"/placeholder/hero","alt":"Athlete setting up a heavy deadlift in a dark training hall","width":1280,"height":853,"widths":[640,1280,2048]}}'::jsonb),
  ('stats', '{"items":[{"value":"10+","label":"Years in Baneshwor"},{"value":"500+","label":"Active members"},{"value":"8","label":"Certified coaches"},{"value":"4.9","label":"Google rating"}]}'::jsonb),
  ('about', '{"heading":"More than\na gym.","body":"A training floor built for people who show up — in their first week or their fifth year. Coaches who know your name, equipment that’s ready when you are, and a room full of people working just as hard as you.","images":[{"src":"/placeholder/squat-bw","alt":"Member holding a barbell across her shoulders before a squat","width":1280,"height":853,"widths":[640,1280]},{"src":"/placeholder/gym-floor","alt":"Rows of dumbbells along the main training floor","width":1280,"height":853,"widths":[640,1280]}]}'::jsonb),
  ('why_us', '{"heading":"Why people\nstay.","items":[{"title":"Coaches who coach","description":"Our trainers walk the floor, correct your form and check in on your progress."},{"title":"Equipment that works","description":"Racks, platforms and free weights kept in order, so you’re never waiting on broken kit."},{"title":"A clean floor","description":"Cleaned throughout the day. Weights go back where they belong."},{"title":"Built around results","description":"Every programme starts with your goal and gets reviewed as you progress."},{"title":"People who show up","description":"Train alongside members who’ll notice when you skip a week."}]}'::jsonb),
  ('trial_cta', '{"heading":"Your first workout\nstarts here.","body":"Come in, train a full session with a coach, and see if we’re the right fit. No commitment.","cta":{"label":"Book a free trial","to":"/free-trial"},"image":{"src":"/placeholder/deadlift-close","alt":"Lifter gripping a loaded barbell","width":1280,"height":853,"widths":[640,1280,2048]}}'::jsonb);

insert into public.services (slug, title, short_description, image, sort_order, published) values
  ('strength-training', 'Strength training', 'Barbells, racks and platforms for lifting heavy, safely.', '{"src":"/placeholder/deadlift","alt":"Loaded barbell on the lifting platform","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 0, true),
  ('personal-training', 'Personal training', 'One-to-one coaching built around your goal and schedule.', '{"src":"/placeholder/dumbbell-row","alt":"Coach-guided dumbbell row","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 1, true),
  ('cardio', 'Cardio', 'Treadmills, bikes and rowers for conditioning and fat loss.', '{"src":"/placeholder/gym-hall","alt":"Cardio area with treadmills and bikes","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 2, true),
  ('group-classes', 'Group classes', 'Coached sessions that keep you moving and accountable.', '{"src":"/placeholder/group-class","alt":"Members in a group mat class","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 3, true),
  ('functional-training', 'Functional training', 'Ropes, sleds and kettlebells for strength you can use.', '{"src":"/placeholder/battle-ropes","alt":"Member training with battle ropes","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 4, true),
  ('nutrition', 'Nutrition', 'Simple, realistic eating plans that support your training.', '{"src":"/placeholder/mobility","alt":"Member stretching on a mat","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 5, true);

insert into public.trainers (slug, name, position, years_experience, specializations, photo, sort_order, published) values
  ('sagar-thapa', 'Sagar Thapa', 'Head coach', 9, array['Strength', 'Powerlifting']::text[], '{"src":"/placeholder/trainer-1","alt":"Portrait of coach Sagar Thapa","width":1280,"height":1920,"widths":[640,1280]}'::jsonb, 0, true),
  ('anisha-gurung', 'Anisha Gurung', 'Personal trainer', 6, array['Fat loss', 'Beginners']::text[], '{"src":"/placeholder/trainer-2","alt":"Portrait of trainer Anisha Gurung","width":1280,"height":1920,"widths":[640,1280]}'::jsonb, 1, true),
  ('bikash-rai', 'Bikash Rai', 'Strength coach', 7, array['Hypertrophy', 'Conditioning']::text[], '{"src":"/placeholder/trainer-3","alt":"Portrait of coach Bikash Rai","width":1280,"height":853,"widths":[640,1280]}'::jsonb, 2, true),
  ('prerana-shrestha', 'Prerana Shrestha', 'Group class coach', 5, array['Functional', 'Mobility']::text[], '{"src":"/placeholder/trainer-4","alt":"Portrait of coach Prerana Shrestha","width":1280,"height":1920,"widths":[640,1280]}'::jsonb, 3, true);

insert into public.membership_plans (name, price_npr, duration_label, duration_months, features, is_popular, sort_order, published) values
  ('Monthly', 3500, '1 month', 1, array['Full gym access', 'Locker and showers', 'Fitness assessment']::text[], false, 0, true),
  ('Quarterly', 9500, '3 months', 3, array['Full gym access', 'Locker and showers', 'Fitness assessment', 'Starter programme']::text[], false, 1, true),
  ('Half year', 17000, '6 months', 6, array['Full gym access', 'Locker and showers', 'Monthly progress check', 'Group classes included']::text[], true, 2, true),
  ('Yearly', 30000, '12 months', 12, array['Full gym access', 'Locker and showers', 'Monthly progress check', 'Group classes included', '2 personal training sessions']::text[], false, 3, true);

insert into public.faqs (question, answer, sort_order, published) values
  ('I’ve never trained before. Is that okay?', 'Yes. Every new member gets a walkthrough of the floor and a starter programme, and coaches are on the floor to help with form.', 0, true),
  ('Can I try the gym before joining?', 'Yes. Book a free trial session online or on WhatsApp and train with a coach before you decide.', 1, true),
  ('Do you offer personal training?', 'Yes, as single sessions or monthly packages. Ask at the front desk or send us a message for current rates.', 2, true),
  ('Do you have student discounts?', 'Students with a valid ID get a discount on quarterly and longer memberships.', 3, true),
  ('Is there parking?', 'There is free bike parking in front of the building. Car parking is limited.', 4, true);

insert into public.blog_categories (name, slug, sort_order) values
  ('Fitness', 'fitness', 0),
  ('Nutrition', 'nutrition', 1),
  ('Training', 'training', 2),
  ('Lifestyle', 'lifestyle', 3),
  ('Gym news', 'gym-news', 4),
  ('Beginner guides', 'beginner-guides', 5);

