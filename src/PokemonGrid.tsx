import Pagination from "./Pagination";

export interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
}

interface Props {
  pokemons: Pokemon[];
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onSelect: (pokemon: Pokemon) => void;
}

export default function PokemonGrid({
  pokemons,
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onSelect,
}: Props) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div className="flex flex-col items-center w-full px-4">
      <div
        className="
          w-full sm:w-[90%] md:w-[85%] lg:w-[80%] 
          grid gap-6 mb-6
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        "
      >
        {pokemons.map((pokemon) => (
          <div
            key={pokemon.id}
            onClick={() => onSelect(pokemon)}
            className="bg-gray-800 rounded-3xl p-6 flex flex-col items-center hover:scale-105 transform transition cursor-pointer shadow-2xl"
          >
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 mb-4 object-contain"
            />

            <span className="text-gray-300 text-lg font-medium mb-1">
              N.º {pokemon.id.toString().padStart(3, "0")}
            </span>

            <h3 className="capitalize font-bold text-2xl sm:text-3xl mb-4 text-white text-center">
              {pokemon.name}
            </h3>

            <div className="flex gap-4 sm:gap-6 mt-2 flex-wrap justify-center">
              {pokemon.types.map((t) => (
                <span
                  key={t.type.name}
                  className={`text-[1rem] sm:text-[1.1rem] capitalize px-4 py-2 rounded-full font-semibold ${getTypeColor(
                    t.type.name
                  )}`}
                >
                  {t.type.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={onPageChange}
      />
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
