import 'server-only'

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import { supabase } from '~/lib/supabase'

import type { Database } from '~/lib/supabase'

import {
  fetchFragranceByNameWithClient,
  notionFragranceRowToCatalog,
  type FragranceRow,
} from '~/lib/fragrancesQuery'

export type { FragranceRow }
export { fetchFragranceByNameWithClient, notionFragranceRowToCatalog }

let _fragrancesReadClient: SupabaseClient<Database> | null = null

/**
 * Notion wrapper FDW reads credentials from `vault`; queries as `anon` hit
 * "permission denied for schema vault". Use the service role on the server only
 * when `SUPABASE_SECRET_KEY` is set; otherwise fall back to the public client.
 */
function supabaseForFragrancesRead(): SupabaseClient<Database> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SECRET_KEY?.trim()
  if (url && serviceKey) {
    if (!_fragrancesReadClient) {
      _fragrancesReadClient = createClient<Database>(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    }
    return _fragrancesReadClient
  }
  return supabase()
}

/**
 * Loads a row where the Notion `name` title matches case-insensitively,
 * using a server-side JSON path filter on `notion.fragrances.attrs`.
 *
 * Prefer `fetchFragranceByNameWithClient` from `~/lib/fragrancesQuery` in Node CLIs (e.g. `pnpm index:docs`)
 * to avoid importing this `server-only` module.
 */
export async function getFragranceByName(name: string): Promise<FragranceRow | null> {
  return fetchFragranceByNameWithClient(supabaseForFragrancesRead(), name)
}
