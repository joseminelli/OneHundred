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

    // 1. Recebe os parâmetros do frontend, com valores padrão.
    const { searchTerm, limit = 12, offset = 0 } = await req.json()
    if (!searchTerm) {
      throw new Error('Termo de busca não fornecido.')
    }

    const headers = {
      'Client-ID': TWITCH_CLIENT_ID,
      'Authorization': `Bearer ${TWITCH_ACCESS_TOKEN}`,
      'Content-Type': 'text/plain',
      'Accept': 'application/json',
    }
    const countPromise = fetch('https://api.igdb.com/v4/games/count', {
      method: 'POST',
      headers,
      body: `search "${searchTerm}"; where category = (0, 8, 9);`,
    })

    const dataPromise = fetch('https://api.igdb.com/v4/games', {
      method: 'POST',
      headers,
      body: `
        search "${searchTerm}";
        fields name, cover.url, first_release_date;
        where category = (0, 8, 9);
        limit ${limit};
        offset ${offset};
      `,
    })

    // 3. Executa as duas requisições ao mesmo tempo para mais eficiência.
    const [countResponse, dataResponse] = await Promise.all([countPromise, dataPromise])

    if (!countResponse.ok || !dataResponse.ok) {
      throw new Error(`Erro na API da IGDB. Status Count: ${countResponse.status}, Status Data: ${dataResponse.status}`)
    }

    const { count } = await countResponse.json()
    const games = await dataResponse.json()

    // 4. Retorna um objeto com os jogos e a contagem total.
    const responsePayload = {
      games,
      totalCount: count,
    }

    return new Response(JSON.stringify(responsePayload), {
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
