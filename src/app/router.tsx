import { createBrowserRouter } from 'react-router'
import { homepageQuery } from '../api/homepage'
import { siteSettingsQuery } from '../api/settings'
import { PublicLayout } from '../components/layout/PublicLayout'
import { queryClient } from '../lib/queryClient'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import { PageStub } from '../pages/PageStub'
import { RouteError } from '../pages/RouteError'

// Home is imported eagerly (it's the landing page); other pages become lazy routes as they're built.
const stub = (path: string, title: string) => ({ path, element: <PageStub title={title} /> })

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    errorElement: <RouteError />,
    // Settings drive the nav, footer and contact links, so they load before first paint.
    loader: () => queryClient.ensureQueryData(siteSettingsQuery),
    hydrateFallbackElement: <div className="min-h-svh" />,
    children: [
      { index: true, element: <Home />, loader: () => queryClient.ensureQueryData(homepageQuery) },
      stub('about', 'About'),
      stub('services', 'Services'),
      stub('services/:slug', 'Service'),
      stub('membership', 'Membership'),
      stub('trainers', 'Trainers'),
      stub('trainers/:slug', 'Trainer'),
      stub('gallery', 'Gallery'),
      stub('blog', 'Blog'),
      stub('blog/:slug', 'Article'),
      stub('faq', 'FAQ'),
      stub('contact', 'Contact'),
      stub('free-trial', 'Free trial'),
      { path: '*', element: <NotFound /> },
    ],
  },
])
