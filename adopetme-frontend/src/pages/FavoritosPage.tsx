// adopetme-frontend/src/pages/FavoritosPage.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Pet } from "../models/PetModel";
import Footer from "../components/Footer";
import { getMyFavoritos } from "../services/FavoritoService";
import { useSession } from "../context/SessionContext";
import { ImageOff, Loader2, HeartCrack } from "lucide-react";

const API_HOST = "http://localhost:8081";


export default function FavoritosPage() {
  const navigate = useNavigate();
  const { token, userRole } = useSession(); // ✅ corrigido
  
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewDetails = (petId: number) => {
    navigate(`/pets/${petId}`);
  };

  useEffect(() => {
    // 5. Redirecionar se não for USER
    if (userRole && userRole !== 'USER') {
      navigate('/');
      return;
    }

    if (token) {
      const fetchFavoritos = async () => {
        setLoading(true);
        setError(null);
        try {
          const favoritos = await getMyFavoritos(token);
          setResults(favoritos);
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erro desconhecido ao buscar favoritos.");
          }
        } finally {
          setLoading(false);
        }
      };
      fetchFavoritos();
    } else {
      // Se não tiver token, redireciona para o login
      navigate('/login');
    }
  }, [token, userRole, navigate]);

  return (
    <div className="min-h-screen w-screen bg-[#FFF8F0] flex flex-col">
      <Navbar />

      <main className="flex flex-col items-center p-6 text-[#3b1f0e] flex-1">
        <h1 className="text-3xl font-semibold mb-4">
          Meus Pets Favoritos 💖
        </h1>

        {loading && (
          <div className="flex flex-col items-center justify-center p-10">
            <Loader2 className="w-12 h-12 animate-spin text-[#c4742a]" />
            <p className="text-lg text-gray-600 mt-4">Carregando favoritos...</p>
          </div>
        )}
        
        {error && (
          <p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg">{error}</p>
        )}

        {!loading && !error && results.length === 0 && (
          <div className="flex flex-col items-center justify-center p-10 text-center">
            <HeartCrack className="w-16 h-16 text-gray-400" />
            <p className="text-lg text-gray-600 mt-4">Você ainda não favoritou nenhum pet.</p>
            <button
              onClick={() => navigate('/search')}
              className="mt-4 bg-[#c4742a] text-white px-6 py-2 rounded-lg hover:bg-[#a75e22] transition-all">
              Buscar pets
            </button>
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {results.map((pet) => {
              const imageUrl = pet.fotoUrl 
                ? `${API_HOST}${pet.fotoUrl}`
                : null;

              return (
                <div
                  key={pet.id}
                  className="bg-white rounded-2xl shadow-md p-5 w-72 text-center border border-[#c4742a]/20"
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={pet.nome}
                      className="rounded-xl mx-auto mb-3 w-full h-48 object-cover" 
                    />
                  ) : (
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
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
