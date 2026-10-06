import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { MembershipPlan } from '../types/content'

async function fetchPlans(): Promise<MembershipPlan[]> {
  const { data, error } = await supabase
    .from('membership_plans')
    .select('id, name, price_npr, duration_label, duration_months, features, is_popular')
    .eq('published', true)
    .order('sort_order')
  if (error) throw error

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    priceNpr: row.price_npr,
    durationLabel: row.duration_label,
    durationMonths: row.duration_months,
    features: row.features,
    isPopular: row.is_popular,
  }))
}

export const plansQuery = queryOptions({ queryKey: ['plans'], queryFn: fetchPlans })

export const usePlans = () => useSuspenseQuery(plansQuery).data
