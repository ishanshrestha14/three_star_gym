import { useFaqs } from '../api/faqs'
import { usePlans } from '../api/plans'
import { useSiteSettings } from '../api/settings'
import { useSections } from '../api/sections'
import { EmptyState } from '../components/content/EmptyState'
import { FaqList } from '../components/sections/FaqList'
import { MembershipPlans } from '../components/sections/MembershipPlans'
import { PageHeader } from '../components/sections/PageHeader'
import { TrialCta } from '../components/sections/TrialCta'
import { Seo } from '../components/seo/Seo'
import { Container } from '../components/ui/Container'
import { CtaLink } from '../components/ui/CtaLink'
import { pages } from '../content/pages'
import { telHref, whatsappHref } from '../lib/contact'

export default function Membership() {
  const plans = usePlans()
  const faqs = useFaqs().filter((faq) => faq.category === 'Membership')
  const { trialCta } = useSections()
  const site = useSiteSettings()

  return (
    <>
      <Seo title="Membership" description={pages.membership.seoDescription} />
      <PageHeader title={pages.membership.title} intro={pages.membership.intro} />
      {plans.length > 0 ? (
        <MembershipPlans plans={plans} showHeader={false} />
      ) : (
        <Container className="py-16 md:py-24">
          <EmptyState title="Ask us about prices" body="Plans and prices are being updated. Call or message us and we’ll tell you the current options.">
            <CtaLink to={whatsappHref(site)}>Message on WhatsApp</CtaLink>
            <CtaLink to={telHref(site.phone)} variant="outline">
              Call {site.phone}
            </CtaLink>
          </EmptyState>
        </Container>
      )}
      <FaqList faqs={faqs} title={'Membership\nquestions.'} />
      {trialCta && <TrialCta content={trialCta} />}
    </>
  )
}
