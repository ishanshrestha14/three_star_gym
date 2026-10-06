import { queryOptions, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import type { TablesUpdate } from '../../types/database'

export const adminSettingsQuery = queryOptions({
  queryKey: ['admin', 'settings'],
  staleTime: 0,
  queryFn: async () => {
    const { data, error } = await supabase.from('site_settings').select('*').single()
    if (error) throw error
    return data
  },
})

export function useSaveSettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: TablesUpdate<'site_settings'>) => {
      const { error } = await supabase.from('site_settings').update(values).eq('id', true)
      if (error) throw error
    },
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin', 'settings'] }),
        queryClient.invalidateQueries({ queryKey: ['site-settings'] }),
      ]),
  })
}
