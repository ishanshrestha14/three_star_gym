import type { EnsureQueryDataOptions } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { AdminError } from '../admin/AdminError'
import { requireAdmin } from '../admin/guard'
import { faqsQuery } from '../api/faqs'
import { plansQuery } from '../api/plans'
import { sectionsQuery } from '../api/sections'
import { serviceQuery, servicesQuery } from '../api/services'
import { siteSettingsQuery } from '../api/settings'
import { testimonialsQuery } from '../api/testimonials'
import { trainersQuery } from '../api/trainers'
import { transformationsQuery } from '../api/transformations'
import { PublicLayout } from '../components/layout/PublicLayout'
import { queryClient } from '../lib/queryClient'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import { PageStub } from '../pages/PageStub'
import { RouteError } from '../pages/RouteError'

/** Loader that makes sure every listed query is cached before the page renders. */
const ensure =
  (...queries: { queryKey: readonly unknown[] }[]) =>
  () =>
    Promise.all(queries.map((query) => queryClient.ensureQueryData(query as EnsureQueryDataOptions)))

/** Code-split route: the module's default export becomes the route component. */
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

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
      {
        index: true,
        element: <Home />,
        loader: ensure(
          sectionsQuery,
          servicesQuery,
          trainersQuery,
          plansQuery,
          faqsQuery,
          testimonialsQuery,
          transformationsQuery,
        ),
      },
      stub('about', 'About'),
      {
        path: 'services',
        loader: ensure(servicesQuery, sectionsQuery),
        lazy: lazyPage(() => import('../pages/Services')),
      },
      {
        path: 'services/:slug',
        loader: ({ params }) => ensure(serviceQuery(params.slug ?? ''), servicesQuery, sectionsQuery)(),
        lazy: lazyPage(() => import('../pages/ServiceDetail')),
      },
      {
        path: 'membership',
        loader: ensure(plansQuery, faqsQuery, sectionsQuery),
        lazy: lazyPage(() => import('../pages/Membership')),
      },
      stub('trainers', 'Trainers'),
      stub('trainers/:slug', 'Trainer'),
      stub('gallery', 'Gallery'),
      stub('blog', 'Blog'),
      stub('blog/:slug', 'Article'),
      stub('faq', 'FAQ'),
      stub('contact', 'Contact'),
      {
        path: 'free-trial',
        loader: () => queryClient.ensureQueryData(plansQuery),
        lazy: lazyPage(() => import('../pages/FreeTrial')),
      },
      { path: '*', element: <NotFound /> },
    ],
  },

  // Admin: separate layout and bundle, never loaded by visitors.
  {
    path: 'admin/login',
    lazy: lazyPage(() => import('../admin/pages/Login')),
    errorElement: <AdminError />,
    hydrateFallbackElement: <div className="min-h-svh" />,
  },
  {
    path: 'admin/reset-password',
    lazy: lazyPage(() => import('../admin/pages/ResetPassword')),
    errorElement: <AdminError />,
    hydrateFallbackElement: <div className="min-h-svh" />,
  },
  {
    path: 'admin',
    loader: requireAdmin,
    lazy: lazyPage(() => import('../admin/AdminLayout')),
    errorElement: <AdminError />,
    hydrateFallbackElement: <div className="min-h-svh" />,
    children: [
      { index: true, lazy: lazyPage(() => import('../admin/pages/Dashboard')) },
      { path: 'enquiries', lazy: lazyPage(() => import('../admin/pages/Enquiries')) },
      { path: 'enquiries/:id', lazy: lazyPage(() => import('../admin/pages/EnquiryDetail')) },
    ],
  },
])
