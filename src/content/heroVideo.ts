/*
  Background video for the homepage hero. The files live in public/hero/ and
  are served by Vercel, not Supabase, to stay inside Supabase's free download
  limit. To replace them, run scripts/hero-video.sh on a new clip and redeploy.
  Set to null to show only the hero photo from Admin → Homepage → Hero.
*/
export const heroVideo: { desktop: string; mobile: string } | null = {
  desktop: '/hero/hero-desktop.mp4',
  mobile: '/hero/hero-mobile.mp4',
}
