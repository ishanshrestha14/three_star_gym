import { useFaqs } from '../api/faqs'
import { useGallery } from '../api/gallery'
import { usePlans } from '../api/plans'
import { useSections } from '../api/sections'
import { useSiteSettings } from '../api/settings'
import { useServices } from '../api/services'
import { useTestimonials } from '../api/testimonials'
import { useTrainers } from '../api/trainers'
import { useTransformations } from '../api/transformations'
import { BrandIntro } from '../components/sections/BrandIntro'
import { FaqList } from '../components/sections/FaqList'
import { GalleryStrip } from '../components/sections/GalleryStrip'
import { Hero } from '../components/sections/Hero'
import { MembershipPlans } from '../components/sections/MembershipPlans'
import { PageHeader } from '../components/sections/PageHeader'
import { ServiceRows } from '../components/sections/ServiceRows'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Testimonials } from '../components/sections/Testimonials'
import { TrainersShowcase } from '../components/sections/TrainersShowcase'
import { Transformations } from '../components/sections/Transformations'
import { TrialCta } from '../components/sections/TrialCta'
import { WhyUs } from '../components/sections/WhyUs'
import { GymJsonLd } from '../components/seo/GymJsonLd'
import { Seo } from '../components/seo/Seo'

/* All data is fetched by the route loader before this renders; hidden or empty sections drop out. */
export default function Home() {
  const sections = useSections()
  const site = useSiteSettings()
  const services = useServices()
  const trainers = useTrainers()
  const plans = usePlans()
  const faqs = useFaqs()
  const testimonials = useTestimonials()
  const transformations = useTransformations()
  const gallery = useGallery()

  return (
    <>
      <Seo />
      <GymJsonLd />
      {/* Hidden or invalid hero: a plain header keeps the page's heading and clears the fixed navbar. */}
      {sections.hero ? (
        <Hero content={sections.hero} />
      ) : (
        <div className="pb-12 md:pb-16">
          <PageHeader title={site.name} intro={site.description} />
        </div>
      )}
      <StatsStrip stats={sections.stats} />
      {sections.about && <BrandIntro content={sections.about} />}
      <ServiceRows services={services} />
      {sections.whyUs && <WhyUs content={sections.whyUs} />}
      <Transformations items={transformations.slice(0, 3)} />
      <TrainersShowcase trainers={trainers.slice(0, 4)} />
      <GalleryStrip images={gallery.slice(0, 6)} />
      <MembershipPlans plans={plans} />
      <Testimonials testimonials={testimonials.slice(0, 6)} />
      {sections.trialCta && <TrialCta content={sections.trialCta} />}
      <FaqList faqs={faqs.slice(0, 5)} />
    </>
  )
}
