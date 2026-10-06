import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { heroSchema, parseOrNull, trialCtaSchema } from '../../../schemas/content'
import { adminSectionsQuery } from '../../api/sections'
import { EmptyState, ErrorState, LoadingRows, Panel } from '../../components/ui'
import { HeroForm } from './HeroForm'
import { TrialCtaForm } from './TrialCtaForm'

/* Loads one homepage section and shows the form made for it. */
export default function SectionEdit() {
  const { key } = useParams()
  const sections = useQuery(adminSectionsQuery)

  if (sections.isPending) return <Panel><LoadingRows rows={6} /></Panel>
  if (sections.isError) return <Panel><ErrorState onRetry={() => void sections.refetch()} /></Panel>

  const content = sections.data.find((s) => s.key === key)?.content

  switch (key) {
    case 'hero':
      return <HeroForm content={parseOrNull(heroSchema, content, 'hero')} />
    case 'trial_cta':
      return <TrialCtaForm content={parseOrNull(trialCtaSchema, content, 'trial CTA')} />
    default:
      return (
        <Panel>
          <EmptyState title="That section doesn’t exist." />
        </Panel>
      )
  }
}
