import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const SearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // ===============================================================
  // 🔹 Aqui futuramente entrará a requisição para a API.
  // const API_URI = "https://suaapi.com/api/pets/search";  // <--- URI da requisição
  //
  // async function handleSearch() {
  //   const response = await fetch(`${API_URI}?q=${searchQuery}`);
  //   const data = await response.json();
  //   // Armazenar dados e redirecionar:
  //   navigate("/search-results", { state: { results: data } });
  // }
  // ===============================================================

  // 🔸 Por enquanto, busca simulada:
  function handleSearch() {
    console.log("Busca simulada por:", searchQuery);
    navigate("/search-results"); // <--- redirecionamento para SearchResultsPage
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50 flex flex-col overflow-x-hidden">
      {/* Navbar fixa no topo */}
      <Navbar />

      {/* Conteúdo Principal */}
      <main className="flex-1 w-full flex justify-center">
        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-10 py-16">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-neutral-950 mb-4">
              🐾 Encontre seu novo melhor amigo
            </h1>
            <p className="text-lg text-stone-600">
              Utilize os filtros abaixo para encontrar o pet perfeito.
            </p>
          </header>

          {/* Barra de busca e filtros */}
          <section className="bg-white p-8 rounded-2xl shadow-md border border-amber-100 mb-12">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <input
                type="text"
                placeholder="Digite o nome do pet ou espécie..."
                className="flex-1 w-full px-5 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="px-8 py-3 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full transition duration-200"
              >
                Buscar
              </button>
            </div>

            {/* 🔸 Aqui futuramente podem entrar filtros adicionais (raça, idade, etc.) */}
          </section>

          {/* Resultados simulados */}
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Resultados recentes:
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {["Pet 1", "Pet 2", "Pet 3"].map((pet, index) => (
                <div
                  key={index}
                  className="h-48 bg-white border border-dashed border-amber-400/60 rounded-xl flex items-center justify-center text-stone-700 font-medium shadow-sm hover:shadow-md transition"
                >
                  {pet}
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      {/* Rodapé simples */}
      <footer className="bg-amber-100 py-6 mt-12 text-center text-stone-600 text-sm w-full">
        © 2025 adopet.me — Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default SearchPage;
