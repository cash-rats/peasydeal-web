import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { envs } from '~/utils/env';

let _supabaseAdminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient(): SupabaseClient {
  if (_supabaseAdminClient) return _supabaseAdminClient;

  const url = envs.SUPABASE_URL;
  const serviceRoleKey = envs.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  _supabaseAdminClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return _supabaseAdminClient;
}

