// supabase/functions/get-game-details/index.ts

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
    if (!TWITCH_CLIENT_ID || !TWITCH_ACCESS_TOKEN) {
      throw new Error('As credenciais da Twitch não foram encontradas.')
    }

    const { gameId } = await req.json()
    if (!gameId) {
      throw new Error('ID do jogo não fornecido.')
    }

    // Query super completa para buscar o máximo de detalhes
    const query = `
      fields
        name,
        summary,
        storyline,
        cover.url,
        screenshots.url,
        videos.video_id,
        first_release_date,
        genres.name,
        themes.name,
        platforms.name,
        involved_companies.company.name, involved_companies.developer, involved_companies.publisher,
        game_engines.name,
        total_rating,
        aggregated_rating,
        websites.url, websites.category;
      where id = ${gameId};
    `

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
      throw new Error(`Erro na API da IGDB: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // A API retorna um array, mas como buscamos por ID, pegamos apenas o primeiro resultado
    return new Response(JSON.stringify(data[0]), {
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
