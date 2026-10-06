import { useFaqs } from '../api/faqs'
import { usePlans } from '../api/plans'
import { useSections } from '../api/sections'
import { FaqList } from '../components/sections/FaqList'
import { MembershipPlans } from '../components/sections/MembershipPlans'
import { PageHeader } from '../components/sections/PageHeader'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { pages } from '../content/pages'

export default function Membership() {
  const plans = usePlans()
  const faqs = useFaqs().filter((faq) => faq.category === 'Membership')
  const { trialCta } = useSections()

  return (
    <>
      <Seo title="Membership" description={pages.membership.seoDescription} />
      <PageHeader title={pages.membership.title} intro={pages.membership.intro} />
      <MembershipPlans plans={plans} showHeader={false} />
      <FaqList faqs={faqs} title={'Membership\nquestions.'} />
      {trialCta && <TrialCta content={trialCta} />}
    </>
  )
}
