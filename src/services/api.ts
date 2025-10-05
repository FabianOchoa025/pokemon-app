import type { Pokemon } from "../types/pokemon";

const API_BASE = "https://pokeapi.co/api/v2";

export const getPokemons = async (offset = 0, limit = 20): Promise<Pokemon[]> => {
  const response = await fetch(`${API_BASE}/pokemon?offset=${offset}&limit=${limit}`);
  const data = await response.json();

  const pokemons: Pokemon[] = await Promise.all(
    data.results.map(async (p: any) => {
      const res = await fetch(p.url);
      const details = await res.json();
      return {
        id: details.id,
        name: details.name,
        image: details.sprites.front_default,
        types: details.types.map((t: any) => t.type.name),
      };
    })
  );

  return pokemons;
};