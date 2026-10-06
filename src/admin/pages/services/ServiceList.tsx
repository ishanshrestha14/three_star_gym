import { ContentListPage } from '../../components/ContentListPage'

export default function ServiceList() {
  return (
    <ContentListPage
      table="services"
      path="services"
      title="Services"
      description="What the gym offers. Each service has its own page, and they appear in this order on the homepage."
      addLabel="Add service"
      emptyTitle="No services yet."
      emptyBody="Add what the gym offers, like strength training, personal training or group classes."
      toItem={(service) => ({ title: service.title, subtitle: service.short_description, image: service.image as never })}
      imagesOf={(service) => [service.image as never]}
    />
  )
}
