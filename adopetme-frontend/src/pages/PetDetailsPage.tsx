// adopetme-frontend/src/pages/PetDetailsPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import { Heart, Home, PawPrint, Calendar } from "lucide-react";
import Footer from "../components/Footer";
import { getPetById } from "../services/PetService"; // 1. Importar o serviço real

// 2. Remover o MOCK_PETS
// const MOCK_PETS: Pet[] = [ ... ];

export default function PetDetailsPage() {
    // Captura o ID do pet da URL (ex: /pets/1)
    const { id } = useParams<{ id: string }>();
    
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null); // 3. Adicionar estado de erro

    useEffect(() => {
        const fetchPet = async () => {
            setLoading(true);
            setError(null);
            try {
                const petId = parseInt(id || '0');
                if (isNaN(petId) || petId <= 0) {
                    throw new Error("ID de pet inválido.");
                }
                // 4. Simulação de API substituída pela chamada real
                const foundPet = await getPetById(petId);
                setPet(foundPet);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Erro desconhecido ao buscar o pet.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPet();
    }, [id]);

    // Trata estados de carregamento
    if (loading) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center bg-[#FFF8F0]">
                <p className="text-xl text-[#c4742a]">Carregando detalhes do pet...</p>
            </div>
        );
    }

    // 5. Tratar erro de API ou Pet não encontrado
    if (error || !pet) {
        return (
            <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0]">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-10">
                    <h1 className="text-4xl font-bold text-[#3b1f0e] mb-4">Pet não encontrado 😢</h1>
                    <p className="text-lg text-[#7b5a3b]">
                        {error || "Verifique o ID ou volte para a página de busca."}
                    </p>
                </main>
            </div>
        );
    }

    // 6. Usar dados reais da API (pet.especie, pet.idade, pet.sexo, pet.descricao)
    return (
        <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0] overflow-x-hidden">
            <Navbar />

            {/* Main usa flex-1 para empurrar o footer */}
            <main className="flex-1 w-full flex flex-col items-center py-10 px-6 sm:px-8 lg:px-10">
                <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#c4742a]/30">
                    
                    <div className="p-8 md:p-12 flex flex-col md:flex-row gap-8">
                        
                        {/* Imagem e Botões */}
                        <div className="md:w-1/3 flex flex-col items-center">
                            <img
                                src={`https://place-puppy.com/300x300?image=${pet.id}`} // Placeholder
                                alt={pet.nome}
                                className="w-full h-auto max-w-xs rounded-2xl object-cover border-4 border-[#c4742a]/50 shadow-lg mb-6"
                            />

                            <button className="w-full max-w-xs px-8 py-3 bg-[#c4742a] hover:bg-[#a75e22] text-neutral-50 font-bold rounded-full transition-all duration-200 flex items-center justify-center mb-4">
                                <Heart className="mr-2" size={20} /> Adotar {pet.nome}
                            </button>
                            
                            <button className="w-full max-w-xs px-8 py-3 border border-[#3b1f0e] text-neutral-50 font-bold rounded-full transition-all duration-200 flex items-center justify-center hover:bg-[#3b1f0e] hover:text-white">
                                <PawPrint className="mr-2" size={20} /> Favoritar
                            </button>
                        </div>

                        {/* Detalhes do Pet */}
                        <div className="md:w-2/3">
                            <h1 className="text-5xl font-extrabold text-[#3b1f0e] mb-2">{pet.nome}</h1>
                            <p className="text-xl text-[#c4742a] font-semibold mb-6">{pet.especie}</p>

                            <div className="grid grid-cols-2 gap-4 text-lg text-[#3b1f0e] mb-8">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Idade:** {pet.idade} anos</span>
                                </div>
                                <div className="flex items-center">
                                    <Home className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Porte:** Médio</span>
                                </div>
                                <div className="flex items-center">
                                    <Heart className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Gênero:** {pet.sexo}</span>
                                </div>
                                <div className="flex items-center">
                                    <PawPrint className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Raça:** SRD</span>
                                </div>
                            </div>
                            
                            {/* Descrição Longa */}
                            <h2 className="text-2xl font-bold text-[#3b1f0e] mb-3">Sobre {pet.nome}</h2>
                            <p className="text-lg leading-relaxed text-[#7b5a3b]">
                                {pet.descricao}
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Rodapé com logo */}
            <Footer />
        </div>
    );
}