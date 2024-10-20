"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Pokemon {
    name: string;
    url: string;
}

const HomeScreen: React.FC = () => {
    const router = useRouter();
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
    const [selectedType, setSelectedType] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");

    useEffect(() => {
        const fetchPokemons = async () => {
            try {
                const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=50");
                const data = await res.json();
                setPokemons(data.results);
                setFilteredPokemons(data.results);
            } catch (error) {
                console.error("Error fetching Pokémon list:", error);
            }
        };
        fetchPokemons();
    }, []);


    useEffect(() => {
        const filterPokemons = () => {
            let filteredList = pokemons;
            if (selectedType) {
                filteredList = filteredList.filter((pokemon) =>
                    pokemon.name.toLowerCase().includes(selectedType.toLowerCase())
                );
            }
            setFilteredPokemons(filteredList);
        };

        filterPokemons();
    }, [searchTerm, selectedType, pokemons]);

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(event.target.value);
    };

    const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let filteredList = pokemons;
        if (searchTerm) {
            filteredList = filteredList.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredPokemons(filteredList);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handlePokemonClick = (name: string) => {
        router.push(`/${name}`);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-bold mb-4 pb-4 ">Pokemon ({filteredPokemons.length})</h1>

            <div className="flex flex-wrap flex-col sm:flex-row gap-4 mb-6">
                <div className="w-full">
                    <select
                        className="p-2 border border-gray rounded-lg w-3/12 h-10"
                        value={selectedType}
                        onChange={handleTypeChange}
                    >
                        <option value="">Select</option>
                        {filteredPokemons.map((type) => (
                            <option key={type?.name} value={type?.name}>
                                {type?.name?.charAt(0)?.toUpperCase() + type?.name?.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                <form onSubmit={handleSearchSubmit} className="w-full flex mb-6 pr-40">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 px-3 border border-gray rounded-l-lg flex-1"
                        value={searchTerm}
                        onChange={handleSearchChange}
                    />
                    <button type="submit" className="min-w-[80px] rounded-r-lg bg-primary text-white text-sm">Search</button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredPokemons.length > 0 ? (
                    filteredPokemons.map((item) => {
                        const pokemonId = item.url.split('/')[6];
                        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

                        return (
                            <div
                                key={item?.name}
                                className="cursor-pointer border border-gray p-0 rounded shadow hover:shadow-lg overflow-hidden"
                                onClick={() => handlePokemonClick(item?.name)}
                            >
                                <div className="w-fill bg-white flex items-center ">
                                    <Image
                                        src={imageUrl}
                                        alt={item?.name}
                                        width={100}
                                        height={100}
                                        //  layout="responsive"
                                        className="w-full h-auto"
                                    />
                                </div>
                                <p className="text-md p-4">
                                    {item?.name?.charAt(0).toUpperCase() + item?.name?.slice(1)}
                                </p>
                            </div>
                        );
                    })
                ) : (
                    <p>No Pokémon found.</p>
                )}
            </div>
        </div>
    );
};

export default HomeScreen;
