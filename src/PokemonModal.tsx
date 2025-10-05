import { useEffect, useState } from "react";
import type { Pokemon } from "./types/pokemon";

interface Props {
  pokemon: Pokemon | null;
  onClose: () => void;
}

interface PokemonDetails {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  species: { name: string };
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  moves: { move: { name: string } }[];
}

const toTitleCase = (text: string) =>
  text
    .split(/[-\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export default function PokemonModal({ pokemon, onClose }: Props) {
  const [details, setDetails] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    if (!pokemon) return;

    const fetchDetails = async () => {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.id}`);
      const data = await res.json();
      setDetails(data);
    };

    fetchDetails();
  }, [pokemon]);

  if (!pokemon || !details) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-gray-900 text-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-y-auto max-h-[90vh] p-8 grid grid-cols-1 md:grid-cols-3 gap-12 transform scale-100 animate-fadeIn z-10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl z-20"
        >
          ✕
        </button>

        <div className="flex flex-col justify-center items-center">
          <img
            src={details.sprites.front_default}
            alt={details.name}
            className="w-48 h-48 md:w-64 md:h-64 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          />
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
            <h2 className="text-3xl font-bold">{toTitleCase(details.name)}</h2>
            <span className="text-gray-400">
              N.º {details.id.toString().padStart(3, "0")}
            </span>
          </div>

          <button
            onClick={() => {
              const utterance = new SpeechSynthesisUtterance(details.name);
              speechSynthesis.speak(utterance);
            }}
            className="px-4 py-2 bg-gray-700 rounded-full hover:bg-gray-600 w-max transition-colors"
          >
            🔊 Listen
          </button>

          <div className="flex gap-5 flex-wrap">
            {details.types.map((t) => (
              <span
                key={t.type.name}
                className={`px-4 py-2 rounded-full font-semibold ${getTypeColor(
                  t.type.name
                )}`}
              >
                {toTitleCase(t.type.name)}
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-2">Stats</h3>
            <div className="flex flex-col gap-3">
              {details.stats.map((s) => (
                <div key={s.stat.name}>
                  <div className="flex justify-between text-sm">
                    <span>{toTitleCase(s.stat.name)}</span>
                    <span className="font-bold">{s.base_stat}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-1 overflow-hidden">
                    <div
                      className="h-2 bg-gradient-to-r from-green-400 to-green-600 transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.min(s.base_stat, 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-3">
          <h3 className="text-2xl font-semibold mb-2 text-center md:text-left">Information</h3>
          <p className="mb-1">
            <strong>Height:</strong> {details.height / 10} m
          </p>
          <p className="mb-1">
            <strong>Weight:</strong> {details.weight / 10} kg
          </p>

          <div>
            <strong>Skills:</strong>
            <div className="flex flex-wrap gap-2 mt-3 mb-2">
              {details.abilities.map((a) => (
                <span
                  key={a.ability.name}
                  className="px-4 py-1 rounded-full bg-gray-700 font-semibold"
                >
                  {toTitleCase(a.ability.name)}
                </span>
              ))}
            </div>
          </div>

          <div>
            <strong>Moves:</strong>
            <div className="flex flex-wrap gap-2 mt-3">
              {details.moves.slice(0, 10).map((m) => (
                <span
                  key={m.move.name}
                  className="px-4 py-1 rounded-full bg-gray-700 font-semibold"
                >
                  {toTitleCase(m.move.name)}
                </span>
              ))}
            </div>
          </div>
        </div>
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
