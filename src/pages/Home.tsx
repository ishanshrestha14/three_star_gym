import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'

/* Temporary shell — the real homepage is built in Phase 2. */
export default function Home() {
  return (
    <>
      <Seo />
      <section className="flex min-h-svh items-end pb-24 md:pb-16">
        <Container>
          <h1 className="type-display text-mega">
            Build your
            <br />
            strongest self.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <CtaLink to="/free-trial">Start your journey</CtaLink>
            <CtaLink to="/membership" variant="outline">
              Explore memberships
            </CtaLink>
          </div>
        </Container>
      </section>
      <div className="h-[100svh]" aria-hidden />
    </>
  )
}
