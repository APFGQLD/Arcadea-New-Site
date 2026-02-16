
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zlnqzostzgcvrrpszcue.supabase.co';
const supabaseKey = 'sb_publishable_N2RAFvVPfnIndiEZz2zQWA_TX2h7gka';

export const supabase = createClient(supabaseUrl, supabaseKey);
