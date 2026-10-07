import { useSections } from '../api/sections'
import { useServices } from '../api/services'
import { EmptyState } from '../components/content/EmptyState'
import { PageHeader } from '../components/sections/PageHeader'
import { ServiceFeatures } from '../components/sections/ServiceFeatures'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { pages } from '../content/pages'

export default function Services() {
  const services = useServices()
  const { trialCta } = useSections()

  return (
    <>
      <Seo title="Services" description={pages.services.seoDescription} />
      <PageHeader title={pages.services.title} intro={pages.services.intro} />
      {services.length > 0 ? (
        <ServiceFeatures services={services} />
      ) : (
        <Container className="py-16 md:py-24">
          <EmptyState
            title="Services coming soon"
            body="We’re adding the details of what we offer. Book a free trial and a coach will show you around."
          />
        </Container>
      )}
      {trialCta && <TrialCta content={trialCta} />}
    </>
  )
}
