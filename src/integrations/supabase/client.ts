// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://uegvgfyrfxltqmqphtyo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlZ3ZnZnlyZnhsdHFtcXBodHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2MDQwNjAsImV4cCI6MjA2MDE4MDA2MH0.NpgmNbucRWDjynzWXYO19xZUfFsAYcY2ah1hO5Lb2CA";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);