-- =============================================================================
-- Initial schema: CMS content, enquiries, admins, storage.
--
-- Security model
--   * RLS is enabled on every table. No policy = no access.
--   * public.is_admin() is the single gate for every write.
--   * Visitors (anon) can read published content and nothing else.
--   * Visitors never touch the enquiries table directly; they call
--     public.submit_enquiry(), which validates, rate-limits and inserts.
-- =============================================================================


-- -----------------------------------------------------------------------------
-- Enums
-- -----------------------------------------------------------------------------

create type public.enquiry_status as enum (
  'new', 'contacted', 'interested', 'follow_up', 'converted', 'closed', 'spam'
);

create type public.enquiry_source as enum (
  'contact_form', 'free_trial', 'membership', 'whatsapp', 'website'
);

create type public.post_status as enum ('draft', 'published', 'archived');


-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Images are stored as jsonb matching the frontend `Image` type:
-- { "src": "<storage path or /public path>", "alt": "...", "width": 1280, "height": 853, "widths": [640, 1280] }
create function public.is_valid_image(image jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select image is null or (
    jsonb_typeof(image) = 'object'
    and jsonb_typeof(image -> 'src') = 'string'
    and length(image ->> 'src') between 1 and 500
    and jsonb_typeof(image -> 'alt') = 'string'
    and jsonb_typeof(image -> 'width') = 'number'
    and jsonb_typeof(image -> 'height') = 'number'
    and jsonb_typeof(image -> 'widths') = 'array'
    and jsonb_array_length(image -> 'widths') > 0
  );
$$;


-- -----------------------------------------------------------------------------
-- Admins
-- -----------------------------------------------------------------------------

-- One row per person allowed into /admin. Rows are added from the Supabase
-- dashboard (SQL editor), never from the website.
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  -- Single role in V1; kept as a column so roles can be added later.
  role text not null default 'admin' check (role in ('admin')),
  created_at timestamptz not null default now()
);

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = (select auth.uid())
  );
$$;


-- -----------------------------------------------------------------------------
-- Site settings (single row) and homepage sections
-- -----------------------------------------------------------------------------

create table public.site_settings (
  id boolean primary key default true check (id), -- enforces a single row
  gym_name text not null,
  short_name text not null,
  city text not null,
  area text not null default '',
  description text not null default '',
  phone text not null default '',
  whatsapp_number text not null default '' check (whatsapp_number ~ '^([0-9]{8,15})?$'),
  whatsapp_message text not null default '',
  email text not null default '',
  address text not null default '',
  google_maps_url text not null default '',
  google_business_url text not null default '',
  instagram_url text not null default '',
  facebook_url text not null default '',
  tiktok_url text not null default '',
  -- [{ "days": "Sunday – Friday", "hours": "5:00 am – 9:00 pm" }]
  opening_hours jsonb not null default '[]' check (jsonb_typeof(opening_hours) = 'array'),
  logo jsonb check (public.is_valid_image(logo)),
  updated_at timestamptz not null default now()
);

-- Free-form homepage blocks. The shape of `content` per key is validated by
-- the matching Zod schema in the app.
create table public.homepage_sections (
  key text primary key check (key in ('hero', 'stats', 'about', 'why_us', 'trial_cta')),
  content jsonb not null check (jsonb_typeof(content) = 'object'),
  is_visible boolean not null default true,
  updated_at timestamptz not null default now()
);


-- -----------------------------------------------------------------------------
-- Content tables
-- -----------------------------------------------------------------------------

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 1 and 100),
  short_description text not null default '',
  body text not null default '',
  image jsonb check (public.is_valid_image(image)),
  benefits text[] not null default '{}',
  audience text not null default '',
  what_to_expect text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.trainers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  name text not null check (length(name) between 1 and 100),
  position text not null default '',
  years_experience integer not null default 0 check (years_experience between 0 and 80),
  specializations text[] not null default '{}',
  bio text not null default '',
  certifications text[] not null default '{}',
  photo jsonb check (public.is_valid_image(photo)),
  -- { "instagram": "https://...", "facebook": "https://..." }
  social_links jsonb not null default '{}' check (jsonb_typeof(social_links) = 'object'),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.membership_plans (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 60),
  price_npr integer not null check (price_npr >= 0),
  duration_label text not null default '',
  duration_months integer check (duration_months > 0),
  features text[] not null default '{}',
  is_popular boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  photo jsonb check (public.is_valid_image(photo)),
  rating smallint not null check (rating between 1 and 5),
  content text not null check (length(content) between 1 and 2000),
  source text not null default 'website' check (source in ('google', 'facebook', 'website', 'other')),
  source_url text not null default '',
  review_date date,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.transformations (
  id uuid primary key default gen_random_uuid(),
  person_name text not null check (length(person_name) between 1 and 100),
  before_image jsonb not null check (public.is_valid_image(before_image)),
  after_image jsonb not null check (public.is_valid_image(after_image)),
  duration_label text not null default '',
  goal text not null default '',
  result text not null default '',
  testimonial text not null default '',
  -- The member agreed to have their photos published.
  consent_confirmed boolean not null default false,
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transformations_published_requires_consent check (not published or consent_confirmed)
);

create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  image jsonb not null check (public.is_valid_image(image) and length(image ->> 'alt') > 0),
  caption text not null default '',
  category text not null default 'gym'
    check (category in ('gym', 'equipment', 'training', 'members', 'events', 'facilities')),
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null check (length(question) between 1 and 300),
  answer text not null check (length(answer) between 1 and 3000),
  category text not null default 'general',
  sort_order integer not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null check (length(title) between 1 and 200),
  excerpt text not null default '',
  content text not null default '', -- Markdown
  cover_image jsonb check (public.is_valid_image(cover_image)),
  author_name text not null default '',
  trainer_id uuid references public.trainers (id) on delete set null,
  category_id uuid references public.blog_categories (id) on delete set null,
  tags text[] not null default '{}',
  status public.post_status not null default 'draft',
  -- A future date schedules the post: it stays hidden until then.
  published_at timestamptz,
  is_featured boolean not null default false,
  seo_title text not null default '',
  seo_description text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint blog_posts_published_needs_date check (status <> 'published' or published_at is not null)
);

create index blog_posts_public_idx on public.blog_posts (status, published_at desc);


-- -----------------------------------------------------------------------------
-- Enquiries
-- -----------------------------------------------------------------------------

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) between 1 and 100),
  phone text not null check (phone ~ '^[0-9+() -]{7,20}$'),
  email text check (email is null or (length(email) <= 254 and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$')),
  subject text check (subject is null or length(subject) <= 150),
  message text check (message is null or length(message) <= 2000),
  source public.enquiry_source not null default 'website',
  status public.enquiry_status not null default 'new',
  membership_plan_id uuid references public.membership_plans (id) on delete set null,
  assigned_to uuid references public.admins (user_id) on delete set null,
  page_path text check (page_path is null or length(page_path) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index enquiries_created_at_idx on public.enquiries (created_at desc);
create index enquiries_status_idx on public.enquiries (status);
create index enquiries_phone_recent_idx on public.enquiries (phone, created_at desc);

create table public.enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries (id) on delete cascade,
  author_id uuid references public.admins (user_id) on delete set null default auth.uid(),
  body text not null check (length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);

create index enquiry_notes_enquiry_idx on public.enquiry_notes (enquiry_id, created_at);

-- Public entry point for every website form. Runs with elevated rights so
-- visitors never need any privilege on the enquiries table itself.
create function public.submit_enquiry(
  p_name text,
  p_phone text,
  p_email text default null,
  p_subject text default null,
  p_message text default null,
  p_source public.enquiry_source default 'website',
  p_membership_plan_id uuid default null,
  p_page_path text default null,
  p_website text default null -- honeypot: real visitors never fill this in
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_phone text := btrim(p_phone);
begin
  -- Bots that fill the hidden field get a silent "success".
  if coalesce(btrim(p_website), '') <> '' then
    return;
  end if;

  if (
    select count(*) from public.enquiries
    where phone = v_phone and created_at > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001',
      hint = 'Too many enquiries from this number. Try again later or call the gym.';
  end if;

  -- Crude flood guard across all senders.
  if (
    select count(*) from public.enquiries where created_at > now() - interval '10 minutes'
  ) >= 50 then
    raise exception 'rate_limited' using errcode = 'P0001',
      hint = 'The form is busy right now. Try again shortly or call the gym.';
  end if;

  insert into public.enquiries (
    name, phone, email, subject, message, source, membership_plan_id, page_path
  )
  values (
    btrim(p_name),
    v_phone,
    nullif(lower(btrim(p_email)), ''),
    nullif(btrim(p_subject), ''),
    nullif(btrim(p_message), ''),
    p_source,
    p_membership_plan_id,
    p_page_path
  );
end;
$$;


-- -----------------------------------------------------------------------------
-- updated_at triggers
-- -----------------------------------------------------------------------------

do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'homepage_sections', 'services', 'trainers', 'membership_plans',
    'testimonials', 'transformations', 'gallery_images', 'faqs', 'blog_posts', 'enquiries'
  ]
  loop
    execute format(
      'create trigger set_updated_at before update on public.%I
       for each row execute function public.set_updated_at()', t
    );
  end loop;
end;
$$;


-- -----------------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------------

alter table public.admins enable row level security;
alter table public.site_settings enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.services enable row level security;
alter table public.trainers enable row level security;
alter table public.membership_plans enable row level security;
alter table public.testimonials enable row level security;
alter table public.transformations enable row level security;
alter table public.gallery_images enable row level security;
alter table public.faqs enable row level security;
alter table public.blog_categories enable row level security;
alter table public.blog_posts enable row level security;
alter table public.enquiries enable row level security;
alter table public.enquiry_notes enable row level security;

-- Defence in depth: visitors have no table privileges on private data at all,
-- so a mistaken policy later still can't expose it.
revoke all on public.admins, public.enquiries, public.enquiry_notes from anon;

-- Admins
create policy "Admins can view admins; users can view their own row"
  on public.admins for select to authenticated
  using (user_id = (select auth.uid()) or (select public.is_admin()));

-- Publishable content: visitors see published rows, admins see and manage all.
do $$
declare
  t text;
begin
  foreach t in array array[
    'services', 'trainers', 'membership_plans', 'testimonials',
    'transformations', 'gallery_images', 'faqs'
  ]
  loop
    execute format(
      'create policy "Published rows are public" on public.%I for select to anon, authenticated
       using (published or (select public.is_admin()))', t);
    execute format(
      'create policy "Admins can insert" on public.%I for insert to authenticated
       with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admins can update" on public.%I for update to authenticated
       using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admins can delete" on public.%I for delete to authenticated
       using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- Blog posts: public once published and the publish date has passed.
create policy "Published posts are public" on public.blog_posts for select to anon, authenticated
  using ((status = 'published' and published_at <= now()) or (select public.is_admin()));
create policy "Admins can insert" on public.blog_posts for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update" on public.blog_posts for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete" on public.blog_posts for delete to authenticated
  using ((select public.is_admin()));

-- Blog categories: always public, admin-managed.
create policy "Categories are public" on public.blog_categories for select to anon, authenticated
  using (true);
create policy "Admins can insert" on public.blog_categories for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update" on public.blog_categories for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete" on public.blog_categories for delete to authenticated
  using ((select public.is_admin()));

-- Site settings: public read, admin update. The single row is created by seed
-- and can't be inserted or deleted from the app.
create policy "Settings are public" on public.site_settings for select to anon, authenticated
  using (true);
create policy "Admins can update" on public.site_settings for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Homepage sections: visible ones are public; admins see hidden ones too.
create policy "Visible sections are public" on public.homepage_sections for select to anon, authenticated
  using (is_visible or (select public.is_admin()));
create policy "Admins can insert" on public.homepage_sections for insert to authenticated
  with check ((select public.is_admin()));
create policy "Admins can update" on public.homepage_sections for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- Enquiries: admin only. Visitors insert through submit_enquiry().
create policy "Admins can view enquiries" on public.enquiries for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can update enquiries" on public.enquiries for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins can delete enquiries" on public.enquiries for delete to authenticated
  using ((select public.is_admin()));

-- Enquiry notes: admin only; notes are always attributed to their author.
create policy "Admins can view notes" on public.enquiry_notes for select to authenticated
  using ((select public.is_admin()));
create policy "Admins can add their own notes" on public.enquiry_notes for insert to authenticated
  with check ((select public.is_admin()) and author_id = (select auth.uid()));
create policy "Admins can delete notes" on public.enquiry_notes for delete to authenticated
  using ((select public.is_admin()));


-- -----------------------------------------------------------------------------
-- Function privileges
-- -----------------------------------------------------------------------------

revoke execute on function public.submit_enquiry from public;
grant execute on function public.submit_enquiry to anon, authenticated;

revoke execute on function public.is_admin from public;
grant execute on function public.is_admin to anon, authenticated;


-- -----------------------------------------------------------------------------
-- Storage: one public bucket for all site media
-- -----------------------------------------------------------------------------

-- Public bucket: anyone can fetch a file by URL. Listing, uploading, replacing
-- and deleting are admin-only via the policies below. SVG is excluded because
-- it can carry scripts.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media', 'media', true, 5 * 1024 * 1024,
  array['image/webp', 'image/jpeg', 'image/png', 'image/avif']
)
on conflict (id) do nothing;

create policy "Admins can list media" on storage.objects for select to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
create policy "Admins can upload media" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "Admins can replace media" on storage.objects for update to authenticated
  using (bucket_id = 'media' and (select public.is_admin()))
  with check (bucket_id = 'media' and (select public.is_admin()));
create policy "Admins can delete media" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (select public.is_admin()));
