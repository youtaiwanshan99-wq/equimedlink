import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const service = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'

export const supabaseAdmin = createClient(url, service, {
  auth: { autoRefreshToken: false, persistSession: false }
})
