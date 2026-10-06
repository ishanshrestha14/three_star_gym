import { ContentListPage } from '../../components/ContentListPage'

export default function TestimonialList() {
  return (
    <ContentListPage
      table="testimonials"
      path="testimonials"
      title="Testimonials"
      description="Member reviews. The section appears on the homepage once at least one is published."
      addLabel="Add review"
      emptyTitle="No reviews yet."
      emptyBody="Copy in real reviews from Google or Facebook, word for word. The homepage section stays hidden until you add one."
      toItem={(review) => ({
        title: review.name,
        subtitle: `${'★'.repeat(review.rating)} ${review.content}`,
      })}
      imagesOf={(review) => [review.photo as never]}
    />
  )
}
