import 'server-only'

import { cache } from 'react'

import { supabase } from '~/lib/supabase'

import type { Database } from 'common'

export type FragranceRow = Database['public']['Tables']['fragrances']['Row']

/**
 * Loads a row where `fragrances.name` matches (case-insensitive).
 */
export const getFragranceByName = cache(async (name: string): Promise<FragranceRow | null> => {
  const q = name.trim()
  if (!q) return null

  const { data, error } = await supabase().from('fragrances').select('*').ilike('name', q).maybeSingle()

  if (error) {
    console.error('[fragrances] getFragranceByName', q, error.message)
    return null
  }

  return data
})
