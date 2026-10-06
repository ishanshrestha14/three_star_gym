import type { EnsureQueryDataOptions } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router'
import { AdminError } from '../admin/AdminError'
import { requireAdmin } from '../admin/guard'
import { postQuery, postsQuery } from '../api/blog'
import { faqsQuery } from '../api/faqs'
import { galleryQuery } from '../api/gallery'
import { plansQuery } from '../api/plans'
import { sectionsQuery } from '../api/sections'
import { serviceQuery, servicesQuery } from '../api/services'
import { siteSettingsQuery } from '../api/settings'
import { testimonialsQuery } from '../api/testimonials'
import { trainerQuery, trainersQuery } from '../api/trainers'
import { transformationsQuery } from '../api/transformations'
import { PublicLayout } from '../components/layout/PublicLayout'
import { queryClient } from '../lib/queryClient'
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import { RouteError } from '../pages/RouteError'

/** Loader that makes sure every listed query is cached before the page renders. */
const ensure =
  (...queries: { queryKey: readonly unknown[] }[]) =>
  () =>
    Promise.all(queries.map((query) => queryClient.ensureQueryData(query as EnsureQueryDataOptions)))

/** Code-split route: the module's default export becomes the route component. */
const lazyPage = (load: () => Promise<{ default: ComponentType }>) => async () => ({ Component: (await load()).default })

// Home is imported eagerly (it's the landing page); every other page is code-split.
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
          galleryQuery,
        ),
      },
      {
        path: 'about',
        loader: ensure(sectionsQuery, trainersQuery),
        lazy: lazyPage(() => import('../pages/About')),
      },
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
      {
        path: 'trainers',
        loader: ensure(trainersQuery, sectionsQuery),
        lazy: lazyPage(() => import('../pages/Trainers')),
      },
      {
        path: 'trainers/:slug',
        loader: ({ params }) => ensure(trainerQuery(params.slug ?? ''), trainersQuery)(),
        lazy: lazyPage(() => import('../pages/TrainerDetail')),
      },
      { path: 'gallery', loader: ensure(galleryQuery), lazy: lazyPage(() => import('../pages/Gallery')) },
      { path: 'blog', loader: ensure(postsQuery), lazy: lazyPage(() => import('../pages/Blog')) },
      {
        path: 'blog/:slug',
        loader: ({ params }) => ensure(postQuery(params.slug ?? ''), postsQuery)(),
        lazy: lazyPage(() => import('../pages/BlogPost')),
      },
      { path: 'faq', loader: ensure(faqsQuery), lazy: lazyPage(() => import('../pages/Faq')) },
      { path: 'contact', lazy: lazyPage(() => import('../pages/Contact')) },
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
    // Full-width article preview, outside the admin layout.
    path: 'admin/blog/:id/preview',
    loader: requireAdmin,
    lazy: lazyPage(() => import('../admin/pages/blog/PostPreview')),
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
      { path: 'transformations', lazy: lazyPage(() => import('../admin/pages/transformations/TransformationList')) },
      { path: 'transformations/:id', lazy: lazyPage(() => import('../admin/pages/transformations/TransformationEdit')) },
      { path: 'testimonials', lazy: lazyPage(() => import('../admin/pages/testimonials/TestimonialList')) },
      { path: 'testimonials/:id', lazy: lazyPage(() => import('../admin/pages/testimonials/TestimonialEdit')) },
      { path: 'gallery', lazy: lazyPage(() => import('../admin/pages/gallery/GalleryList')) },
      { path: 'gallery/:id', lazy: lazyPage(() => import('../admin/pages/gallery/GalleryEdit')) },
      { path: 'homepage', lazy: lazyPage(() => import('../admin/pages/homepage/HomepageSections')) },
      { path: 'homepage/:key', lazy: lazyPage(() => import('../admin/pages/homepage/SectionEdit')) },
      { path: 'blog', lazy: lazyPage(() => import('../admin/pages/blog/PostList')) },
      { path: 'blog/categories', lazy: lazyPage(() => import('../admin/pages/blog/Categories')) },
      { path: 'blog/:id', lazy: lazyPage(() => import('../admin/pages/blog/PostEdit')) },
      { path: 'settings', lazy: lazyPage(() => import('../admin/pages/Settings')) },
      { path: 'faqs', lazy: lazyPage(() => import('../admin/pages/faqs/FaqList')) },
      { path: 'faqs/:id', lazy: lazyPage(() => import('../admin/pages/faqs/FaqEdit')) },
      { path: 'services', lazy: lazyPage(() => import('../admin/pages/services/ServiceList')) },
      { path: 'services/:id', lazy: lazyPage(() => import('../admin/pages/services/ServiceEdit')) },
      { path: 'trainers', lazy: lazyPage(() => import('../admin/pages/trainers/TrainerList')) },
      { path: 'trainers/:id', lazy: lazyPage(() => import('../admin/pages/trainers/TrainerEdit')) },
      { path: 'memberships', lazy: lazyPage(() => import('../admin/pages/memberships/MembershipList')) },
      { path: 'memberships/:id', lazy: lazyPage(() => import('../admin/pages/memberships/MembershipEdit')) },
    ],
  },
])
