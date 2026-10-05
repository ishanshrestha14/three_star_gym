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
import {
  about,
  faqs,
  hero,
  plans,
  services,
  stats,
  testimonials,
  trainers,
  transformations,
  trialCta,
  whyUs,
} from '../content/homepage'

export default function Home() {
  return (
    <>
      <Seo />
      <Hero content={hero} />
      <StatsStrip stats={stats} />
      <BrandIntro content={about} />
      <ServiceRows services={services} />
      <WhyUs content={whyUs} />
      <Transformations items={transformations} />
      <TrainersShowcase trainers={trainers} />
      <MembershipPlans plans={plans} />
      <Testimonials testimonials={testimonials} />
      <TrialCta content={trialCta} />
      <FaqList faqs={faqs} />
    </>
  )
}
