import { useQuery } from '@tanstack/react-query'
import { useRouteLoaderData } from 'react-router'
import { formatDate } from '../../lib/date'
import { supabase } from '../../lib/supabase'
import { ErrorState, LoadingRows, PageHeader, Panel } from '../components/ui'
import type { AdminSession } from '../guard'

const adminsQuery = {
  queryKey: ['admin', 'admins'],
  queryFn: async () => {
    const { data, error } = await supabase.from('admins').select('user_id, email, display_name, created_at').order('created_at')
    if (error) throw error
    return data
  },
}

/*
  Read-only. Creating or removing admins needs the service key, which never
  belongs in the browser, so it's done from the Supabase dashboard.
*/
export default function Admins() {
  const admins = useQuery(adminsQuery)
  // The signed-in admin comes from the /admin layout route's loader.
  const session = useRouteLoaderData('admin') as AdminSession | undefined

  return (
    <>
      <PageHeader title="Admins" description="People who can sign in to this admin panel." />
      <Panel>
        {admins.isPending ? (
          <LoadingRows rows={2} />
        ) : admins.isError ? (
          <ErrorState onRetry={() => void admins.refetch()} />
        ) : (
          <ul className="divide-y divide-chalk/10">
            {admins.data.map((admin) => (
              <li key={admin.user_id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="font-medium">
                    {admin.display_name || admin.email}
                    {admin.email === session?.email && <span className="ml-2 text-sm font-normal text-chalk/50">(you)</span>}
                  </p>
                  {admin.display_name && <p className="text-sm text-chalk/55">{admin.email}</p>}
                </div>
                <p className="text-sm text-chalk/50">Added {formatDate(admin.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      <Panel className="mt-6 p-5 text-sm leading-relaxed text-chalk/75">
        <h2 className="font-semibold text-chalk">Adding or removing an admin</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>
            In the Supabase dashboard, open <strong>Authentication → Users → Add user</strong>. Enter their email and a password, and tick
            Auto Confirm User.
          </li>
          <li>
            In the <strong>SQL editor</strong>, run:
            <pre className="mt-2 overflow-x-auto rounded bg-graphite p-3 text-xs text-chalk">
              {`insert into public.admins (user_id, email, display_name)
select id, email, 'Their name' from auth.users where email = 'their@email.com';`}
            </pre>
          </li>
          <li>
            To remove someone, delete their row from the <strong>admins</strong> table. They lose access immediately.
          </li>
        </ol>
      </Panel>
    </>
  )
}
