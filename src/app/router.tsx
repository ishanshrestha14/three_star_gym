import { createBrowserRouter } from 'react-router'
import { PublicLayout } from '../components/layout/PublicLayout'
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
    children: [
      { index: true, element: <Home /> },
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
