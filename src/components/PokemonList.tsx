import type { Pokemon } from "../types/pokemon";
import PokemonCard from "./PokemonCard";

interface Props {
  pokemons: Pokemon[];
}

function PokemonList({ pokemons }: Props) {
  return (
    <div className="flex justify-center">
      <div className="w-4/5 grid grid-cols-5 grid-rows-4 gap-6">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
}

export default PokemonList;