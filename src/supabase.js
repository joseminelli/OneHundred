import { createClient } from '@supabase/supabase-js'

// 1. Cole sua URL e Chave 'anon' aqui
const supabaseUrl = 'https://fihtixsekdylhzvbcwhu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpaHRpeHNla2R5bGh6dmJjd2h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY3MzY3MDMsImV4cCI6MjA3MjMxMjcwM30.TKynKH-7HX5fT-AtGrF6UYGvkC-l_AQ9ah_YApyRDuM'

// 2. Crie e exporte o cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
