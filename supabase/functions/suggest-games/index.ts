// supabase/functions/suggest-games/index.ts

import { serve } from 'https://deno.land/std@0.160.0/http/server.ts'

const TWITCH_CLIENT_ID = Deno.env.get('TWITCH_CLIENT_ID')
const TWITCH_ACCESS_TOKEN = Deno.env.get('TWITCH_ACCESS_TOKEN')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Se algum dos secrets não for encontrado, retorne um erro claro.
    if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
        throw new Error('As credenciais da Twitch (secrets) não foram encontradas no ambiente da função.')
    }

    const { searchTerm } = await req.json()
    if (!searchTerm) {
      throw new Error('Termo de busca não fornecido.')
    }

    // --- ÚNICA ALTERAÇÃO ESTÁ AQUI ---
    // A query agora é otimizada para sugestões: busca apenas o nome e tem um limite menor.
    const query = `
      search "${searchTerm}";
      fields name;
      where category = (0, 8, 9);
      limit 8;
    `
    // ---------------------------------

    const response = await fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers: {
        'Client-ID': TWITCH_CLIENT_ID,
        'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
        'Content-Type': 'text/plain',
        'Accept': 'application/json',
      },
      body: query,
    })

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Erro da IGDB:", errorBody);
      throw new Error(`Erro na API da IGDB: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
