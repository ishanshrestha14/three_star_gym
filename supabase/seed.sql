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


-- Service detail copy (placeholder, edit freely)
update public.services set
  body = E'Strength is the base for everything else: posture, confidence and staying injury-free as you get older. The floor has squat racks, lifting platforms, barbells and a full run of dumbbells, with coaches nearby to check your setup.\n\nNew to lifting? We start with the basic patterns (squat, hinge, push, pull) and add weight gradually, so you build technique before you chase numbers.',
  benefits = array['Build muscle and bone density', 'Move better in everyday life', 'See real, measurable progress', 'Lower your risk of injury'],
  audience = 'Anyone who wants to get stronger, complete beginners included. You don’t need experience, just a willingness to learn the lifts properly.',
  what_to_expect = 'Your first session covers the core lifts with a coach, using light weights while you learn. From there you follow a simple programme and add weight week by week.'
where slug = 'strength-training';

update public.services set
  body = E'One-to-one sessions with a coach who plans every workout around your goal, your schedule and any injuries you’re working around.\n\nYour coach tracks your progress, adjusts the plan as you improve, and makes sure every rep is done properly. It’s the fastest way to learn and the hardest way to skip a session.',
  benefits = array['A plan built around your goal', 'Form checked on every lift', 'Accountability that keeps you consistent', 'Faster, safer progress'],
  audience = 'People who want results sooner, beginners who want proper guidance, and anyone returning from an injury or a long break.',
  what_to_expect = 'We start with a conversation about your goal and a short movement assessment. Your coach then sets a plan, and you train together two to four times a week.'
where slug = 'personal-training';

update public.services set
  body = E'Treadmills, bikes, rowers and cross-trainers for conditioning, heart health and fat loss. Use them for a steady warm-up, a long easy session or short, hard intervals.\n\nCoaches can show you how to mix cardio into your strength training so one doesn’t get in the way of the other.',
  benefits = array['A stronger heart and lungs', 'More energy through the day', 'Support for fat loss', 'Better recovery between sessions'],
  audience = 'Everyone. Cardio suits every fitness level, and it’s an easy way to start if you’re new to the gym.',
  what_to_expect = 'A coach shows you how to set up each machine and how hard to work. Most members do 20 to 40 minutes alongside their strength training.'
where slug = 'cardio';

update public.services set
  body = E'Coached group sessions that mix strength, conditioning and mobility. A coach leads every class, scales each exercise to your level and keeps the pace up.\n\nClasses are a good way to stay consistent: the time is booked, the workout is planned, and the room keeps you going.',
  benefits = array['Planned, coached workouts', 'Exercises scaled to your level', 'Energy from training with others', 'A routine that’s easy to stick to'],
  audience = 'Members who like training with others, or who would rather follow a plan than write one.',
  what_to_expect = 'Arrive five minutes early and tell the coach if it’s your first class. Sessions run about 45 minutes, including a warm-up and cool-down.'
where slug = 'group-classes';

update public.services set
  body = E'Ropes, sleds, kettlebells and bodyweight work for strength you can actually use: lifting, carrying, climbing stairs, playing sport.\n\nFunctional sessions are short and varied, and they build fitness and coordination together.',
  benefits = array['Strength that carries into daily life', 'Better balance and coordination', 'Conditioning without long cardio sessions', 'Variety that keeps training fresh'],
  audience = 'Anyone who wants to feel more capable day to day, and athletes who want conditioning for their sport.',
  what_to_expect = 'A coach introduces each piece of equipment before you use it. Expect circuits of short, hard efforts with rest in between.'
where slug = 'functional-training';

update public.services set
  body = E'Training is half of the result. We help you eat in a way that supports your goal without strict diets or food you don’t enjoy.\n\nAdvice is practical and built around local food, your schedule and your budget.',
  benefits = array['Simple guidelines you can follow', 'Meals built around local food', 'Support for fat loss or muscle gain', 'Regular check-ins on progress'],
  audience = 'Members who want their nutrition to match their training, whether the goal is losing fat or building muscle.',
  what_to_expect = 'We look at what you eat now and agree a few small changes. Check-ins track progress and adjust the plan as you go.'
where slug = 'nutrition';

-- FAQ categories and the rest of the common questions (placeholder answers, confirm with the gym)
update public.faqs set category = 'Getting started' where question like 'I’ve never trained%' or question like 'Can I try%';
update public.faqs set category = 'Training' where question like 'Do you offer personal training%';
update public.faqs set category = 'Membership' where question like 'Do you have student%';
update public.faqs set category = 'The gym' where question like 'Is there parking%';

insert into public.faqs (question, answer, category, sort_order, published) values
  ('How much does membership cost?', 'Plans start from one month, and longer plans cost less per month. See the membership page for current prices.', 'Membership', 10, true),
  ('Can I pause my membership?', 'Ask at the front desk. We can usually pause longer plans for travel or illness.', 'Membership', 11, true),
  ('How do I pay?', 'Pay at the front desk by cash, card or mobile wallet.', 'Membership', 12, true),
  ('What are your opening hours?', 'Sunday to Friday 5:00 am to 9:00 pm, and Saturday 7:00 am to 12:00 pm.', 'The gym', 13, true),
  ('What equipment do you have?', 'Squat racks, lifting platforms, barbells, a full dumbbell run, cable machines and a cardio area with treadmills, bikes and rowers.', 'The gym', 14, true),
  ('Do you provide diet plans?', 'Yes. Our nutrition coaching gives you simple, realistic eating guidelines built around local food and your goal.', 'Training', 15, true);

-- Trainer bios (placeholder people; replace with the real team). Certifications are
-- left empty on purpose: only list ones the coach actually holds.
update public.trainers set
  bio = E'Sagar has coached on our floor for nine years and leads the coaching team. He specialises in teaching the big lifts, and most of his members come to him having never touched a barbell.\n\nHe’s patient with beginners and demanding with everyone else, and he’ll tell you exactly why each exercise is in your programme.',
  social_links = '{"instagram": "https://instagram.com/"}'
where slug = 'sagar-thapa';

update public.trainers set
  bio = E'Anisha works with people starting from scratch: first-time gym members, people coming back after a long break, and anyone who finds the weights area intimidating.\n\nHer sessions focus on building habits that last, with steady fat loss and strength that shows up in everyday life.',
  social_links = '{"instagram": "https://instagram.com/"}'
where slug = 'anisha-gurung';

update public.trainers set
  bio = E'Bikash coaches members who want to build muscle and get fitter at the same time. His programmes are simple, progressive and tracked week to week.\n\nIf you have trained before but stopped seeing progress, he is the coach to talk to.'
where slug = 'bikash-rai';

update public.trainers set
  bio = E'Prerana runs most of our group classes and functional sessions. Her classes are fast, varied and scaled so everyone in the room gets a good workout.\n\nShe also works one to one on mobility for members dealing with stiffness or recovering from injury.'
where slug = 'prerana-shrestha';

-- Gallery (temporary Unsplash photos; replace with real gym photography)
insert into public.gallery_images (image, caption, category, sort_order, published) values
  ('{"src": "/placeholder/gym-hall", "alt": "Training hall with cardio machines", "width": 1280, "height": 854, "widths": [640, 1280]}'::jsonb, 'The main training hall', 'facilities', 0, true),
  ('{"src": "/placeholder/deadlift", "alt": "Member setting up a deadlift", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, '', 'training', 1, true),
  ('{"src": "/placeholder/dumbbell-wall", "alt": "Wall of dumbbells", "width": 1280, "height": 1920, "widths": [640, 1280]}'::jsonb, 'Dumbbells up to 50 kg', 'equipment', 2, true),
  ('{"src": "/placeholder/group-class", "alt": "Members in a group mat class", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, 'Saturday group class', 'members', 3, true),
  ('{"src": "/placeholder/squat-bw", "alt": "Member preparing to squat", "width": 1280, "height": 854, "widths": [640, 1280]}'::jsonb, '', 'training', 4, true),
  ('{"src": "/placeholder/gym-floor", "alt": "Rows of dumbbells on the training floor", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, '', 'equipment', 5, true),
  ('{"src": "/placeholder/battle-ropes", "alt": "Member training with battle ropes", "width": 1280, "height": 855, "widths": [640, 1280]}'::jsonb, 'Functional training', 'training', 6, true),
  ('{"src": "/placeholder/rack-pull", "alt": "Member pressing a barbell in the rack", "width": 1280, "height": 854, "widths": [640, 1280]}'::jsonb, '', 'training', 7, true),
  ('{"src": "/placeholder/mobility", "alt": "Member stretching on a mat", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, '', 'members', 8, true),
  ('{"src": "/placeholder/dumbbell-row", "alt": "Dumbbell row on the bench", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, '', 'training', 9, true),
  ('{"src": "/placeholder/deadlift-close", "alt": "Hands gripping a loaded barbell", "width": 1280, "height": 853, "widths": [640, 1280, 2048]}'::jsonb, '', 'training', 10, true),
  ('{"src": "/placeholder/hero", "alt": "Lifter in a dark training hall", "width": 1280, "height": 853, "widths": [640, 1280, 2048]}'::jsonb, '', 'gym', 11, true);

-- About page (placeholder copy; replace with the gym’s real story)
insert into public.homepage_sections (key, content) values
  ('about_page', '{"title": "More than\na gym.", "intro": "A training floor in the middle of the neighbourhood, built for people who want to get stronger and stay that way.", "image": {"src": "/placeholder/gym-hall", "alt": "The main training hall", "width": 1280, "height": 853, "widths": [640, 1280]}, "story": {"heading": "How it\nstarted.", "body": "We opened because the city deserved a gym that took training seriously without taking itself too seriously. A place where a first-timer and a competitive lifter can share the floor and both get what they came for.\n\nThe equipment has grown, the team has grown, and the membership has grown. The idea hasn’t changed: good coaching, a clean floor and people who show up for each other."}, "values": {"heading": "What we\nbelieve.", "items": [{"title": "Coaching first", "description": "Equipment matters, but a coach who corrects your form matters more."}, {"title": "Progress over perfection", "description": "Small improvements, every week, add up to results that last."}, {"title": "Everyone belongs", "description": "Beginners, athletes, students, parents. If you want to train, you’re welcome here."}, {"title": "Look after the place", "description": "Re-rack your weights, wipe down the bench, help the person next to you."}]}, "facilities": {"heading": "On the floor", "items": ["Squat racks and lifting platforms", "Barbells, plates and a full dumbbell run", "Cable and resistance machines", "Treadmills, bikes and rowers", "Functional area with ropes, sleds and kettlebells", "Changing rooms, lockers and showers"], "image": {"src": "/placeholder/dumbbell-wall", "alt": "Wall of dumbbells", "width": 1280, "height": 1920, "widths": [640, 1280]}}, "community": {"heading": "Train with\npeople who\nshow up.", "body": "Group classes, weekend sessions and members who notice when you miss a week. The people are why most of our members stay.", "image": {"src": "/placeholder/group-class", "alt": "Members training together in a group class", "width": 1280, "height": 853, "widths": [640, 1280]}}}'::jsonb);

-- Blog posts (placeholder articles; replace or edit in the admin)
insert into public.blog_posts (slug, title, excerpt, content, cover_image, author_name, trainer_id, category_id, tags, status, published_at, is_featured)
select 'your-first-week-at-the-gym', 'Your first week at the gym: what to expect', 'Nervous about starting? Here’s exactly what your first week looks like, from the first walk-through to your third session.', $md$Walking into a gym for the first time is the hardest part. Most people who quit do it in the first two weeks, usually because nobody told them what to do. Here's what your first week with us looks like.

## Day one: the walk-through

A coach shows you around the floor, explains how the equipment works and asks about your goal. There's no test and nobody is judging what you can lift.

## Your first sessions

We start with four movement patterns: **squat, hinge, push and pull**. You'll use light weights or just your body weight while you learn them properly.

- Two or three sessions in the first week is plenty
- Each session takes 45 to 60 minutes
- Feeling sore for a day or two afterwards is normal

## What to bring

Comfortable clothes, indoor training shoes, a water bottle and a small towel. Lockers are available, so bring a lock if you have one.

## The most important thing

Turn up. Consistency beats intensity, especially early on. If you can train twice a week for a month, you've built a habit, and that's when the real progress starts.$md$, '{"src": "/placeholder/group-class", "alt": "Members in a group class", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, 'Anisha Gurung',
  (select id from public.trainers where slug = 'anisha-gurung'), (select id from public.blog_categories where slug = 'beginner-guides'),
  array['beginners', 'getting started']::text[], 'published', now() - interval '3 days', true;
insert into public.blog_posts (slug, title, excerpt, content, cover_image, author_name, trainer_id, category_id, tags, status, published_at, is_featured)
select 'eating-for-strength-on-dal-bhat', 'Eating for strength on dal bhat', 'You don’t need imported supplements to build muscle. A few changes to everyday Nepali meals go a long way.', $md$A lot of new members ask which supplements to buy. Our answer is usually: none yet. Get the basics right with the food you already eat.

## Protein first

Muscle is built from protein, and most of us don't eat enough of it. Easy ways to get more from a normal day:

- An extra bowl of **dal**, or a thicker dal
- **Eggs** at breakfast
- **Chicken, fish or paneer** with dinner a few times a week
- **Chana, rajma or soybeans** as a snack or side

## Keep the rice, watch the portion

Rice isn't the enemy. It's fuel for training. If your goal is fat loss, keep the portion steady and add more vegetables and dal instead of more rice.

## Drink water

Most people training in the evening are already dehydrated by the time they arrive. Aim for a full bottle before your session and another during it.

## When to think about supplements

Once you're eating enough protein most days and training consistently for a few months, ask a coach. Until then, food does the job.$md$, '{"src": "/placeholder/mobility", "alt": "Member stretching after training", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, 'Bikash Rai',
  (select id from public.trainers where slug = 'bikash-rai'), (select id from public.blog_categories where slug = 'nutrition'),
  array['nutrition', 'muscle']::text[], 'published', now() - interval '10 days', false;
insert into public.blog_posts (slug, title, excerpt, content, cover_image, author_name, trainer_id, category_id, tags, status, published_at, is_featured)
select 'squat-hinge-push-pull', 'Squat, hinge, push, pull: the four movements that matter', 'Almost every good strength programme is built on four movement patterns. Learn them well and everything else gets easier.', $md$Strength training can look complicated from the outside. It isn't. Nearly every exercise worth doing is a version of one of four movements.

## Squat

Bending at the knees and hips together, like sitting down and standing up. Builds the legs and teaches your body to stay upright under load.

## Hinge

Bending at the hips with a flat back, like picking something up off the floor. The deadlift is the classic example. It trains the whole back of your body.

## Push

Pushing weight away from you, either forwards (push-ups, bench press) or overhead (shoulder press).

## Pull

Pulling weight towards you: rows, pull-ups and pulldowns. Most people need more pulling than pushing to balance out long days at a desk.

## Putting it together

A simple full-body session picks one exercise from each pattern. Do it two or three times a week, add a little weight when it feels easy, and you have a programme that works for years.$md$, '{"src": "/placeholder/deadlift", "alt": "Barbell set up for a deadlift", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, 'Sagar Thapa',
  (select id from public.trainers where slug = 'sagar-thapa'), (select id from public.blog_categories where slug = 'training'),
  array['strength', 'technique']::text[], 'published', now() - interval '17 days', false;
insert into public.blog_posts (slug, title, excerpt, content, cover_image, author_name, trainer_id, category_id, tags, status, published_at, is_featured)
select 'why-rest-days-make-you-stronger', 'Why rest days make you stronger', 'Training breaks you down. Recovery is where you actually get fitter. Here’s how to rest properly.', $md$It's tempting to think more training is always better. It isn't. Your body gets stronger *after* a session, while it recovers.

## What happens when you rest

Training puts stress on your muscles. During rest, your body repairs that damage and adapts so the same work feels easier next time. Skip the rest and you skip the adaptation.

## How much rest you need

- At least one full rest day a week
- 48 hours before training the same muscles hard again
- 7 to 8 hours of sleep most nights

## Active recovery

Rest doesn't have to mean the sofa. A walk, light cycling or a mobility session keeps you moving without adding more fatigue.

## Signs you need more rest

Constant soreness, poor sleep, weights feeling heavier than usual, or simply not wanting to train. Take an extra day. You won't lose progress, and you'll come back stronger.$md$, '{"src": "/placeholder/squat-bw", "alt": "Member resting between sets", "width": 1280, "height": 853, "widths": [640, 1280]}'::jsonb, 'Prerana Shrestha',
  (select id from public.trainers where slug = 'prerana-shrestha'), (select id from public.blog_categories where slug = 'fitness'),
  array['recovery']::text[], 'published', now() - interval '26 days', false;
