import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ryswjkikhmyotstyscxm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ5c3dqa2lraG15b3RzdHlzY3htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMTYzNTYsImV4cCI6MjA0ODc5MjM1Nn0.ynpt_RllNm3EuWZVIAwOrRqNq0pvamkgLNdL6QTlW5o';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
