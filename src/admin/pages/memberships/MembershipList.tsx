import { formatNpr } from '../../../lib/format'
import { ContentListPage } from '../../components/ContentListPage'

export default function MembershipList() {
  return (
    <ContentListPage
      table="membership_plans"
      path="memberships"
      title="Memberships"
      description="Plans and prices shown on the homepage and the membership page, in this order."
      addLabel="Add plan"
      emptyTitle="No plans yet."
      emptyBody="Add your membership plans so visitors can compare prices before they enquire."
      toItem={(plan) => ({
        title: plan.is_popular ? `${plan.name} (most popular)` : plan.name,
        subtitle: `${formatNpr(plan.price_npr)} for ${plan.duration_label}`,
      })}
    />
  )
}
