
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wuehtecjknyutmsknusk.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZWh0ZWNqa255dXRtc2tudXNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MzQ5OTQsImV4cCI6MjA4NzExMDk5NH0.hl6JWOLHNZuO46jPbBgzieVXjn1cZ8IKbnjVjePcevg'

export const supabase = createClient(supabaseUrl, supabaseKey)
