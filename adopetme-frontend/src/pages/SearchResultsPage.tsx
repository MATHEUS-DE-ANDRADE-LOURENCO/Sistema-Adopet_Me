import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import Footer from "../components/Footer";

export default function SearchResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("q");
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const handleViewDetails = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    setTimeout(() => {
      const mockResults: Pet[] = [
        { id: 1, nome: "Rex", tipo: "Cachorro", idade: "2 anos" },
        { id: 2, nome: "Mia", tipo: "Gato", idade: "1 ano" },
      ];
      setResults(mockResults);
      setLoading(false);
    }, 1200);
  }, [query]);

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center p-6 text-[#3b1f0e]">
        <h1 className="text-3xl font-semibold mb-4">
          Resultados da busca por: <span className="text-[#c4742a]">{query}</span>
        </h1>

        {loading ? (
          <p className="text-lg text-gray-600">Carregando resultados...</p>
        ) : results.length === 0 ? (
          <p className="text-lg text-gray-600">Nenhum pet encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {results.map((pet) => (
              <div
                key={pet.id}
                className="bg-white rounded-2xl shadow-md p-5 w-72 text-center border border-[#c4742a]/20"
              >
                <img
                  src={`https://place-puppy.com/200x200?image=${pet.id}`}
                  alt={pet.nome}
                  className="rounded-xl mx-auto mb-3"
                />
                <h2 className="text-xl font-bold text-[#c4742a]">{pet.nome}</h2>
                <p className="text-sm">{pet.tipo}</p>
                <p className="text-sm text-gray-600">{pet.idade}</p>
                <button
                    onClick={() => handleViewDetails(pet.id)}
                    className="mt-3 bg-[#c4742a] text-white px-4 py-2 rounded-lg hover:bg-[#a75e22] transition-all">
                  Ver mais
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      {/* Rodapé com logo */}
      <Footer />
    </div>
  );
}
