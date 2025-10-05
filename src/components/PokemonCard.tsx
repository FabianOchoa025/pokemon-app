import type { Pokemon } from "../types/pokemon";

interface Props {
  pokemon: Pokemon;
  onSelect?: (pokemon: Pokemon) => void;
}

export default function PokemonCard({ pokemon, onSelect }: Props) {
  return (
    <div
      onClick={() => onSelect && onSelect(pokemon)}
      className="bg-gray-800 rounded-3xl shadow-2xl p-6 flex flex-col items-center hover:scale-105 transition-transform cursor-pointer w-full"
    >
      <img
        src={pokemon.image}
        alt={pokemon.name}
        className="w-32 h-32 mb-4 object-contain"
      />
      <h3 className="capitalize font-bold text-2xl mb-1 text-white">{pokemon.name}</h3>
      <span className="text-gray-300 font-medium mb-3">#{pokemon.id}</span>
      <div className="flex gap-2 flex-wrap justify-center">
        {pokemon.types.map((type) => (
          <span
            key={type}
            className={`capitalize px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(type)}`}
          >
            {type}
          </span>
        ))}
      </div>
    </div>
  );
}

function getTypeColor(type: string) {
  const colors: Record<string, string> = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-400 text-black",
    ice: "bg-blue-200 text-black",
    fighting: "bg-red-700",
    poison: "bg-purple-500",
    ground: "bg-yellow-600",
    flying: "bg-indigo-300 text-black",
    psychic: "bg-pink-500",
    bug: "bg-green-700",
    rock: "bg-gray-500",
    ghost: "bg-indigo-800",
    dragon: "bg-purple-700",
    dark: "bg-gray-800",
    steel: "bg-gray-400 text-black",
    fairy: "bg-pink-300 text-black",
    normal: "bg-gray-300 text-black",
  };
  return colors[type] || "bg-gray-600";
}