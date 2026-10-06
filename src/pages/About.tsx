import { useSections } from '../api/sections'
import { useTrainers } from '../api/trainers'
import { Facilities } from '../components/sections/Facilities'
import { PageHeader } from '../components/sections/PageHeader'
import { StatsStrip } from '../components/sections/StatsStrip'
import { Story } from '../components/sections/Story'
import { TrainersShowcase } from '../components/sections/TrainersShowcase'
import { TrialCta } from '../components/sections/TrialCta'
import { WhyUs } from '../components/sections/WhyUs'
import { Seo } from '../components/seo/Seo'
import NotFound from './NotFound'

export default function About() {
  const { aboutPage: page, stats } = useSections()
  const trainers = useTrainers()

  // The page is hidden from the admin, or its content is incomplete.
  if (!page) return <NotFound />

  return (
    <>
      <Seo title="About" description={page.intro} image={page.image} />
      <PageHeader title={page.title} intro={page.intro} image={page.image} />
      <Story heading={page.story.heading} body={page.story.body} />
      <StatsStrip stats={stats} />
      <WhyUs content={page.values} />
      <Facilities content={page.facilities} />
      <TrainersShowcase trainers={trainers.slice(0, 4)} />
      <TrialCta
        content={{
          heading: page.community.heading,
          body: page.community.body,
          image: page.community.image,
          cta: { label: 'Book a free trial', to: '/free-trial' },
        }}
      />
    </>
  )
}
