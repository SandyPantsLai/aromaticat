/**
 * Public Supabase client key from the dashboard (`sb_publishable_…`).
 * @see https://supabase.com/docs/guides/api/api-keys
 */
export function getSupabasePublicApiKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? ''
}
