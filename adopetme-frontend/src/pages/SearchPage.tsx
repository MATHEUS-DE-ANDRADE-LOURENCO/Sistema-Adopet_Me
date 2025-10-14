import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Search } from "lucide-react";
import Footer from "../components/Footer";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  function handleSearch() {
    if (searchQuery.trim() === "") return;
    console.log("Busca simulada por:", searchQuery);
    navigate(`/search-results?q=${encodeURIComponent(searchQuery)}`);
  }

  function handleKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-[#FFF8F0] overflow-x-hidden">
      <Navbar />
      <main className="flex-1 w-full flex flex-col items-center py-20">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 flex flex-col items-center">
            
            {/* Título */}
            <header className="text-center mb-10 w-full">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#3b1f0e] mb-4">
                🐾 Encontre seu novo melhor amigo
              </h1>
              <p className="text-lg text-[#7b5a3b] max-w-2xl mx-auto">
                Utilize a busca abaixo para encontrar o pet perfeito para você.
              </p>
            </header>

            {/* Área de busca */}
            <section className="bg-white border border-[#c4742a]/20 shadow-md rounded-2xl p-8 w-full max-w-2xl">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-3.5 text-[#c4742a]" size={22} />
                  <input
                    type="text"
                    placeholder="Digite o nome ou espécie do pet..."
                    className="w-full text-neutral-950 pl-12 pr-4 py-3 border border-[#c4742a]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#c4742a]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-8 py-3 bg-[#c4742a] hover:bg-[#a75e22] text-white font-bold rounded-full transition-all duration-200"
                >
                  Buscar
                </button>
              </div>
            </section>

            {/* Resultados simulados */}
            <section className="mt-16 w-full max-w-6xl">
              <h2 className="text-2xl font-bold text-[#3b1f0e] mb-6">
                Resultados recentes
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {["Luna 🐶", "Milo 🐱", "Tobby 🐕"].map((pet, index) => (
                  <div
                    key={index}
                    className="h-48 bg-white border border-[#c4742a]/30 rounded-xl flex items-center justify-center text-[#3b1f0e] font-medium shadow-sm hover:shadow-md hover:scale-[1.02] transition-all"
                  >
                    {pet}
                  </div>
                ))}
              </div>
            </section>
        </div>
      </main>

      {/* Rodapé com logo */}
      <Footer />
    </div>
  );
};

export default SearchPage;