-- Allow an editable About page block alongside the homepage sections.
alter table public.homepage_sections drop constraint homepage_sections_key_check;
alter table public.homepage_sections add constraint homepage_sections_key_check
  check (key in ('hero', 'stats', 'about', 'why_us', 'trial_cta', 'about_page'));
