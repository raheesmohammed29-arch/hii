import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_URL_KEY = 'findback_supabase_url';
const STORAGE_KEY_KEY = 'findback_supabase_anon_key';

export const getSupabaseCredentials = (): { url: string; key: string } => {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  
  const localUrl = (localStorage.getItem(STORAGE_URL_KEY) || '').trim();
  const localKey = (localStorage.getItem(STORAGE_KEY_KEY) || '').trim();

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  return { url, key };
};

export const saveSupabaseCredentials = (url: string, key: string): void => {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, key.trim());
  // Reset cached client
  cachedClient = null;
};

export const clearSupabaseCredentials = (): void => {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
};

export const isSupabaseConfigured = (): boolean => {
  const { url, key } = getSupabaseCredentials();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    key.length > 20
  );
};

let cachedClient: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!cachedClient) {
    const { url, key } = getSupabaseCredentials();
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return cachedClient;
};

export const supabase = getSupabaseClient();

/**
 * Test connectivity to real Supabase instance
 */
export const testSupabaseConnection = async (testUrl?: string, testKey?: string): Promise<{ success: boolean; message: string; details?: any }> => {
  const url = testUrl || getSupabaseCredentials().url;
  const key = testKey || getSupabaseCredentials().key;

  if (!url || !key) {
    return { success: false, message: 'Supabase URL and Anon Key are required.' };
  }

  try {
    const testClient = createClient(url, key, { auth: { persistSession: false } });
    
    // Test simple select on item_reports or check auth health
    const { data, error } = await testClient
      .from('item_reports')
      .select('id')
      .limit(1);

    if (error) {
      // If table doesn't exist yet, we still know Supabase project reached!
      if (error.code === '42P01') {
        return {
          success: true,
          message: 'Connected to Supabase! (Tables not created yet — please run the provided SQL schema in Supabase SQL Editor).',
          details: error.message
        };
      }
      return {
        success: false,
        message: `Supabase error (${error.code || 'API'}): ${error.message}`,
        details: error
      };
    }

    return {
      success: true,
      message: 'Successfully connected to live Supabase database! Tables are accessible.',
      details: { rowCount: data?.length || 0 }
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Connection failed: ${err.message || 'Network error'}`,
    };
  }
};
