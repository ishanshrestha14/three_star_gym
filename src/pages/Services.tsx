import { useSections } from '../api/sections'
import { useServices } from '../api/services'
import { PageHeader } from '../components/sections/PageHeader'
import { ServiceFeatures } from '../components/sections/ServiceFeatures'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { pages } from '../content/pages'

export default function Services() {
  const services = useServices()
  const { trialCta } = useSections()

  return (
    <>
      <Seo title="Services" description={pages.services.seoDescription} />
      <PageHeader title={pages.services.title} intro={pages.services.intro} />
      <ServiceFeatures services={services} />
      {trialCta && <TrialCta content={trialCta} />}
    </>
  )
}
