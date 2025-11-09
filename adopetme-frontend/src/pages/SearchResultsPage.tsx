// adopetme-frontend/src/pages/SearchResultsPage.tsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel"; // O modelo Pet.java é compatível
import Footer from "../components/Footer";
import { getPets } from "../services/PetService"; // 1. Importar o serviço
import { ImageOff } from "lucide-react"; // <-- ADICIONADO

const API_HOST = "http://localhost:8081"; // <-- ADICIONADO

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // 2. Estado de erro

  const handleViewDetails = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    const fetchPets = async () => {
        setLoading(true);
        setError(null);
        try {
            const allPets = await getPets();
            
            // 3. Filtra os pets baseado na query (simples)
            let filteredPets = allPets;
            if (query && query.trim() !== "") {
                filteredPets = allPets.filter(pet => 
                    (pet.nome && pet.nome.toLowerCase().includes(query.toLowerCase())) ||
                    (pet.especie && pet.especie.toLowerCase().includes(query.toLowerCase()))
                );
            }
            
            setResults(filteredPets);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Erro desconhecido ao buscar pets.");
            }
        } finally {
            setLoading(false);
        }
    };

    fetchPets();
  }, [query]); // 4. Executa a busca quando a query mudar

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center p-6 text-[#3b1f0e] flex-1">
        <h1 className="text-3xl font-semibold mb-4">
          {(query && query.trim() !== "")
            ? <>Resultados da busca por: <span className="text-[#c4742a]">{query}</span></>
            : "Todos os Pets Disponíveis"
          }
        </h1>

        {loading && (
          <p className="text-lg text-gray-600">Carregando pets...</p>
        )}
        
        {error && (
            <p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
        )}

        {!loading && !error && results.length === 0 && (
          <p className="text-lg text-gray-600">Nenhum pet encontrado.</p>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            
            {/* INÍCIO DA MODIFICAÇÃO */}
            {results.map((pet) => {
              // 1. Determina a URL completa da imagem
              const imageUrl = pet.fotoUrl 
                ? `${API_HOST}${pet.fotoUrl}` // Ex: http://localhost:8081/uploads/img.png
                : null;
        
              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-md p-5 w-72 text-center border border-[#c4742a]/20"
                >
                  {/* 2. Lógica condicional para exibir a imagem ou o placeholder */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={pet.nome}
                      // Adicionei h-48 e object-cover para padronizar o tamanho
                      className="rounded-xl mx-auto mb-3 w-full h-48 object-cover" 
                    />
                  ) : (
                    // 3. Placeholder para pets sem foto
                    <div className="rounded-xl mx-auto mb-3 w-full h-48 bg-gray-100 flex flex-col items-center justify-center text-gray-400">
                      <ImageOff size={48} />
                      <span className="text-sm mt-2">Sem foto</span>
                    </div>
                  )}
        
                  <h2 className="text-xl font-bold text-[#c4742a]">{pet.nome}</h2>
                  <p className="text-sm">{pet.especie} - {pet.sexo}</p>
                  <p className="text-sm text-gray-600">{pet.idade} anos</p>
                  <button
                      onClick={() => handleViewDetails(pet.id)}
                      className="mt-3 bg-[#c4742a] text-white px-4 py-2 rounded-lg hover:bg-[#a75e22] transition-all">
                    Ver mais
                  </button>
                </div>
              );
            })}
            {/* FIM DA MODIFICAÇÃO */}

          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}