// supabase.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { URL as PolyfillURL, URLSearchParams as PolyfillURLSearchParams } from 'react-native-url-polyfill';

// 🔧 Force-patch URL for the native environment (Snack iOS)
if (typeof URL === 'undefined') {
  global.URL = PolyfillURL;
  global.URLSearchParams = PolyfillURLSearchParams;
}
console.log('supabase.js typeof URL before createClient:', typeof URL);

const supabaseUrl = 'https://ljlletwiohamkupytjrj.supabase.co';
export const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxqbGxldHdpb2hhbWt1cHl0anJqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MDM5MjYsImV4cCI6MjA3OTM3OTkyNn0.bcf8fr-H1pF8gM_lft7kWLnA4h3CmSS9EgVN8-LJyEQ';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { 
  auth: {
    storage: AsyncStorage, 
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // important in native
  },
});

// Debug
// console.log('supabaseUrl raw:', supabaseUrl);
// console.log('supabaseUrl JSON:', JSON.stringify(supabaseUrl));

export const getMakes = async () => {
  try {
    const { data, error } = await supabase.from('makes').select('*');

    if (error) {
      console.log('❌ Error fetching:', error);
      return { data: null, error };
    }
    return data;
  } catch (err) {
    console.log('🔥 Unexpected error:', err);
    return [];
  }
};

export const submitTicket = async (payload) => {
  console.log(payload)
  const { data, error } = await supabase.from('tickets').insert([payload]).select();

  if (error) {
    console.log('❌ submitTicket error:', error);
  } else {
    console.log('✅ ticket inserted:', data);
  }
};