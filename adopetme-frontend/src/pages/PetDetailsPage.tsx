import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import { Heart, Home, PawPrint, Calendar } from "lucide-react";
import Footer from "../components/Footer";

// Mock de Dados: Em uma aplicação real, faria uma chamada de API usando o 'id'.
const MOCK_PETS: Pet[] = [
    { id: 1, nome: "Rex", tipo: "Cachorro", idade: "2 anos" },
    { id: 2, nome: "Mia", tipo: "Gato", idade: "1 ano" },
    { id: 3, nome: "Bolt", tipo: "Cachorro", idade: "3 anos" },
];

export default function PetDetailsPage() {
    // Captura o ID do pet da URL (ex: /pets/1)
    const { id } = useParams<{ id: string }>();
    
    const [pet, setPet] = useState<Pet | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        // Simulação de chamada de API: busca o pet pelo ID
        setTimeout(() => {
            const petId = parseInt(id || '0');
            const foundPet = MOCK_PETS.find(p => p.id === petId) || null;
            
            setPet(foundPet);
            setLoading(false);
        }, 800);
    }, [id]);

    // Trata estados de carregamento e Pet não encontrado
    if (loading) {
        return (
            <div className="min-h-screen w-screen flex items-center justify-center bg-[#FFF8F0]">
                <p className="text-xl text-[#c4742a]">Carregando detalhes do pet...</p>
            </div>
        );
    }

    if (!pet) {
        return (
            <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0]">
                <Navbar />
                <main className="flex-1 flex flex-col items-center justify-center p-10">
                    <h1 className="text-4xl font-bold text-[#3b1f0e] mb-4">Pet não encontrado 😢</h1>
                    <p className="text-lg text-[#7b5a3b]">Verifique o ID ou volte para a página de busca.</p>
                </main>
            </div>
        );
    }

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
                                src={`https://place-puppy.com/300x300?image=${pet.id}`}
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
                            <p className="text-xl text-[#c4742a] font-semibold mb-6">{pet.tipo}</p>

                            <div className="grid grid-cols-2 gap-4 text-lg text-[#3b1f0e] mb-8">
                                <div className="flex items-center">
                                    <Calendar className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Idade:** {pet.idade}</span>
                                </div>
                                <div className="flex items-center">
                                    <Home className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Porte:** Médio</span>
                                </div>
                                <div className="flex items-center">
                                    <Heart className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Gênero:** Fêmea</span>
                                </div>
                                <div className="flex items-center">
                                    <PawPrint className="mr-2 text-[#c4742a]" size={20} />
                                    <span>**Raça:** SRD</span>
                                </div>
                            </div>
                            
                            {/* Descrição Longa */}
                            <h2 className="text-2xl font-bold text-[#3b1f0e] mb-3">Sobre {pet.nome}</h2>
                            <p className="text-lg leading-relaxed text-[#7b5a3b]">
                                {pet.nome} é um(a) {pet.tipo.toLowerCase()} extremamente dócil e brincalhão(a). 
                                Adora longas caminhadas no parque e se dá muito bem com crianças e outros animais. 
                                Ele(a) está à procura de um lar para chamar de seu. É vacinado(a) e castrado(a). 
                                Sua energia é contagiante e ele(a) trará muita alegria para sua família!
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