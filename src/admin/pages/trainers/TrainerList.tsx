import { ContentListPage } from '../../components/ContentListPage'

export default function TrainerList() {
  return (
    <ContentListPage
      table="trainers"
      path="trainers"
      title="Trainers"
      description="Coaches shown on the trainers page, in this order. The first four also appear on the homepage and About page."
      addLabel="Add trainer"
      emptyTitle="No trainers yet."
      emptyBody="Add your coaches with a photo and a short bio. People like to know who’ll be training them."
      toItem={(trainer) => ({
        title: trainer.name,
        subtitle: `${trainer.position}, ${trainer.years_experience} years`,
        image: trainer.photo as never,
      })}
      imagesOf={(trainer) => [trainer.photo as never]}
    />
  )
}
