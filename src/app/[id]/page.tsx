"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ParamsType {
    params: {
        id: string;
    };
}


interface Pokemon {
    name: string;
    sprites: {
        front_default: string;
    };
    types: { type: { name: string } }[];
    stats: { base_stat: number; stat: { name: string } }[];
    abilities: { ability: { name: string } }[];
    game_indices: { version: { name: string } }[];
}

const HomePageDetail: React.FC<ParamsType> = ({ params }) => {
    const router = useRouter();
    const [detailData, setDetailData] = useState<Pokemon | null>(null);

    useEffect(() => {
        if (params.id) {
            const fetchDetailPai = async () => {
                try {
                    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
                    const data = await res.json();
                    setDetailData(data)
                } catch (error) {
                    console.error("Error fetching Pokémon details:", error);
                }
            }
            fetchDetailPai()
        }
    }, [params.id])

    return (
        <div className="container mx-auto p-4">
            <h1 className="font-bold mb-2"><button onClick={() => router.back()}>{"< Back"}</button></h1>

            {detailData &&
                <div className=" border border-gray p-0 rounded shadow hover:shadow-lg 
overflow-hidden">
                    <div className="w-fill bg-white flex items-center ">
                        <Image
                            src={detailData?.sprites?.front_default}
                            alt={detailData?.name}
                            width={100}
                            height={100}
                        //  layout="responsive"
                        // className="w-full h-auto"
                        />
                    </div>
                    <div className="w-fill pt-3 px-4">
                        <p className="text-lg font-bold mb-1">
                            Name: {detailData.name.charAt(0).toUpperCase() + detailData.name.slice(1)}
                        </p>
                        <p className="text-md mb-1">
                            <b>Type:</b> {detailData.types.map((typeObj) => typeObj.type.name).join(", ")}
                        </p>
                        <p className="text-md mb-1 flex">
                        <b>Stats:</b>
                            <ul className="inline-block text-md pl-5 flex flex-wrap">
                                {detailData.stats.map((statObj) => (
                                    <li className="mr-2" key={statObj.stat.name}>
                                        {statObj.stat.name}: {statObj.base_stat},
                                    </li>
                                ))}
                            </ul>
                        </p>
                        <p className="text-md mb-1">
                        <b>Abilities:{" "}</b>
                            {detailData.abilities.map((abilityObj) => abilityObj.ability.name).join(", ")}
                        </p>

                        <p className="text-md mb-4">
                        <b>Some Appearances (Games):{" "} </b>
                            {detailData.game_indices.slice(0, 5).map((gameObj) => gameObj.version.name).join(", ")}
                        </p>

                    </div>
                </div>
            }


        </div>
    );
};

export default HomePageDetail;
