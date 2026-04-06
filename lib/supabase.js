import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ohafbvrxoenrmmcgwqkc.supabase.co'
const supabaseKey = 'sb_publishable_as6G_6_H_f13sPLTO70qHg_QEXvlbQk'

export const supabase = createClient(supabaseUrl, supabaseKey)
