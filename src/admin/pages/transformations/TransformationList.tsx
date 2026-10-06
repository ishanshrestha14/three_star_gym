import { ContentListPage } from '../../components/ContentListPage'

export default function TransformationList() {
  return (
    <ContentListPage
      table="transformations"
      path="transformations"
      title="Transformations"
      description="Before-and-after results. The section appears on the homepage once at least one is published."
      addLabel="Add transformation"
      emptyTitle="No transformations yet."
      emptyBody="Add real member results with their written permission. The homepage section stays hidden until you add one."
      toItem={(item) => ({
        title: item.person_name,
        subtitle: [item.result, item.duration_label && `in ${item.duration_label}`, !item.consent_confirmed && '(no consent recorded)']
          .filter(Boolean)
          .join(' '),
        image: item.after_image as never,
      })}
      imagesOf={(item) => [item.before_image as never, item.after_image as never]}
    />
  )
}
