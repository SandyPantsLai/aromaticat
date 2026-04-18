import 'server-only'

import { cache } from 'react'

import { supabase } from '~/lib/supabase'

import type { Database } from 'common'

export type FragranceRow = Database['public']['Tables']['fragrances']['Row']

export const getFragranceBySlug = cache(async (slug: string): Promise<FragranceRow | null> => {
  const { data, error } = await supabase().from('fragrances').select('*').eq('slug', slug).maybeSingle()

  if (error) {
    console.error('[fragrances] getFragranceBySlug', slug, error.message)
    return null
  }

  return data
})
