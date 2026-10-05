import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'

export default function NotFound() {
  return (
    <>
      <Seo title="Page not found" />
      <Container className="pt-40 pb-32">
        <h1 className="type-display text-display">Page not found</h1>
        <p className="mt-6 max-w-md text-chalk/70">
          This page doesn't exist or has moved. Head back to the homepage to find what you need.
        </p>
        <CtaLink to="/" className="mt-8">
          Go to homepage
        </CtaLink>
      </Container>
    </>
  )
}
