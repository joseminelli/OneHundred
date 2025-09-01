// src/api/igdb.js

// A LINHA QUE FALTAVA ESTÁ AQUI:
import { supabase } from '~/supabase'

export const searchGames = async (searchTerm, limit = 12, offset = 0) => {
  const { data, error } = await supabase.functions.invoke('search-games', {
    body: { searchTerm, limit, offset },
  })

  if (error) {
    throw new Error('Falha ao executar a função de busca.')
  }

  return data
}

export const fetchSuggestions = async (searchTerm) => {
  const { data, error } = await supabase.functions.invoke('suggest-games', {
    body: { searchTerm },
  })

  if (error) {
    throw new Error('Falha ao buscar sugestões.')
  }

  return data
}

// A nova função agora pode usar o 'supabase' que foi importado no topo
export const fetchGameDetailsById = async (gameId) => {
  const { data, error } = await supabase.functions.invoke('get-game-details', {
    body: { gameId },
  })

  if (error) {
    throw new Error('Falha ao buscar detalhes do jogo.')
  }

  return data
}
