import { cn } from '../../lib/cn'
import type { Stat } from '../../types/content'
import { Container } from '../ui/Container'

export function StatsStrip({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null

  return (
    <section aria-label="The gym in numbers">
      <Container>
        <dl className="grid grid-cols-2 border-y border-chalk/15 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'flex flex-col-reverse gap-1 py-8 lg:px-8 lg:py-10',
                index % 2 === 1 && 'border-l border-chalk/15 pl-5',
                index >= 2 && 'border-t border-chalk/15 lg:border-t-0',
                index > 0 ? 'lg:border-l lg:border-chalk/15' : 'lg:pl-0',
              )}
            >
              <dt className="text-sm text-chalk/60">{stat.label}</dt>
              <dd className="type-display text-headline">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  )
}
