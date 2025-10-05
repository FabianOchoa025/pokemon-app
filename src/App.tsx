import { useEffect, useState } from "react";
import PokemonGrid from "./PokemonGrid";
import PokemonModal from "./PokemonModal";
import type { Pokemon } from "./types/pokemon";

const ITEMS_PER_PAGE = 20;
const TOTAL_POKEMON = 649;

interface BasicPokemon {
  name: string;
  url: string;
}

const toTitleCase = (text: any) => {
  if (!text) return "";
  return text
    .toString()
    .split(/[-\s]+/)
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export default function App() {
  const [allPokemons, setAllPokemons] = useState<BasicPokemon[]>([]);
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState<BasicPokemon[]>([]);
  const [typeFilter, setTypeFilter] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    const fetchAllPokemon = async () => {
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${TOTAL_POKEMON}&offset=0`;
      const res = await fetch(url);
      const data = await res.json();
      setAllPokemons(data.results);
    };
    fetchAllPokemon();
  }, []);

  useEffect(() => {
    const fetchTypes = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      setTypes(data.results.map((t: any) => t.name));
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filtered = allPokemons.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 5));
  }, [search, allPokemons]);

  useEffect(() => {
    const fetchPokemons = async () => {
      let toFetch: BasicPokemon[] = [];

      if (typeFilter) {
        const res = await fetch(`https://pokeapi.co/api/v2/type/${typeFilter}`);
        const data = await res.json();
        toFetch = data.pokemon.map((p: any) => p.pokemon).slice(0, ITEMS_PER_PAGE);
      } else if (search.trim() === "") {
        const offset = (currentPage - 1) * ITEMS_PER_PAGE;
        toFetch = allPokemons.slice(offset, offset + ITEMS_PER_PAGE);
      } else {
        toFetch = allPokemons.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      const detailedPokemons: Pokemon[] = await Promise.all(
        toFetch.map(async (p) => {
          const res = await fetch(p.url);
          const data = await res.json();

          return {
            id: data.id,
            name: toTitleCase(data.name),
            image: data.sprites?.front_default || "",
            types: data.types?.map((t: any) => toTitleCase(t.type.name)) || [],
          };
        })
      );

      setPokemons(detailedPokemons);
    };

    fetchPokemons();
  }, [currentPage, search, typeFilter, allPokemons]);

  return (
    <div className="bg-gray-900 min-h-screen p-6 text-white flex flex-col items-center">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative w-70">
          <input
            type="text"
            placeholder="Search Pokémon..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
              setTypeFilter("");
            }}
            className="w-full pl-10 pr-4 py-4 rounded-full bg-gray-800 text-white placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          {suggestions.length > 0 && (
            <ul className="absolute mt-1 w-full bg-gray-800 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto">
              {suggestions.map((s) => (
                <li
                  key={s.name}
                  onClick={() => {
                    setSearch(s.name);
                    setSuggestions([]);
                  }}
                  className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                >
                  {toTitleCase(s.name)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative w-48">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-gray-800 text-white py-3 pl-6 pr-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-500 appearance-none w-full"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t} className="capitalize">
                {toTitleCase(t)}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white">
            ▼
          </div>
        </div>
      </div>

      <PokemonGrid
        pokemons={pokemons}
        currentPage={currentPage}
        itemsPerPage={ITEMS_PER_PAGE}
        totalItems={search ? pokemons.length : TOTAL_POKEMON}
        onPageChange={setCurrentPage}
        onSelect={setSelectedPokemon}
      />

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}
