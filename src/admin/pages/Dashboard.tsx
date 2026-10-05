import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { dashboardQuery } from '../api/enquiries'
import { EnquiryTable } from '../components/EnquiryTable'
import { EmptyState, ErrorState, LoadingRows, PageHeader, Panel } from '../components/ui'

function greeting(hour = new Date().getHours()) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { data, isPending, isError, refetch } = useQuery(dashboardQuery)

  const stats = [
    { label: 'New enquiries', value: data?.newCount, to: '/admin/enquiries?status=new' },
    { label: 'Enquiries this month', value: data?.monthCount, to: '/admin/enquiries' },
    { label: 'Free trial requests this month', value: data?.trialCount, to: '/admin/enquiries' },
    { label: 'Published blog posts', value: data?.postCount },
  ]

  return (
    <>
      <PageHeader title={`${greeting()}.`} description="Here’s what’s happening at the gym." />

      {isError ? (
        <Panel>
          <ErrorState onRetry={() => void refetch()} />
        </Panel>
      ) : (
        <>
          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map((stat) => {
              const body = (
                <>
                  <dt className="text-sm text-chalk/60">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-semibold tabular-nums">
                    {isPending ? <span className="inline-block h-8 w-10 animate-pulse rounded bg-chalk/10" /> : stat.value}
                  </dd>
                </>
              )
              return (
                <Panel key={stat.label} className="p-0">
                  {stat.to ? (
                    <Link to={stat.to} className="block h-full p-4 transition-colors hover:bg-chalk/5">
                      {body}
                    </Link>
                  ) : (
                    <div className="p-4">{body}</div>
                  )}
                </Panel>
              )
            })}
          </dl>

          <Panel className="mt-8">
            <div className="flex items-center justify-between border-b border-chalk/10 px-4 py-3">
              <h2 className="font-medium">Recent enquiries</h2>
              <Link to="/admin/enquiries" className="text-sm text-chalk/60 underline-offset-4 hover:text-chalk hover:underline">
                View all
              </Link>
            </div>
            {isPending ? (
              <LoadingRows rows={4} />
            ) : data.recent.length === 0 ? (
              <EmptyState title="No enquiries yet.">
                When someone contacts the gym through the website, their enquiry will appear here.
              </EmptyState>
            ) : (
              <EnquiryTable rows={data.recent} />
            )}
          </Panel>
        </>
      )}
    </>
  )
}
