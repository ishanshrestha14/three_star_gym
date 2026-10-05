import { useHomepage } from '../api/homepage'
import { BrandIntro } from '../components/sections/BrandIntro'
import { FaqList } from '../components/sections/FaqList'
import { Hero } from '../components/sections/Hero'
import { MembershipPlans } from '../components/sections/MembershipPlans'
import { ServiceRows } from '../components/sections/ServiceRows'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Testimonials } from '../components/sections/Testimonials'
import { TrainersShowcase } from '../components/sections/TrainersShowcase'
import { Transformations } from '../components/sections/Transformations'
import { TrialCta } from '../components/sections/TrialCta'
import { WhyUs } from '../components/sections/WhyUs'
import { Seo } from '../components/seo/Seo'

/* Content is fetched by the route loader before this renders; hidden or empty sections drop out. */
export default function Home() {
  const page = useHomepage()

  return (
    <>
      <Seo />
      {page.hero && <Hero content={page.hero} />}
      <StatsStrip stats={page.stats} />
      {page.about && <BrandIntro content={page.about} />}
      <ServiceRows services={page.services} />
      {page.whyUs && <WhyUs content={page.whyUs} />}
      <Transformations items={page.transformations} />
      <TrainersShowcase trainers={page.trainers} />
      <MembershipPlans plans={page.plans} />
      <Testimonials testimonials={page.testimonials} />
      {page.trialCta && <TrialCta content={page.trialCta} />}
      <FaqList faqs={page.faqs} />
    </>
  )
}
