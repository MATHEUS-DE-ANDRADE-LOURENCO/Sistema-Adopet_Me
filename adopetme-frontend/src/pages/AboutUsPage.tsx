import React from "react";
import Navbar from "../components/Navbar";
import { PawPrint } from "lucide-react";

const AboutUsPage: React.FC = () => {
  return (
    <div className="min-h-screen w-screen bg-amber-50 text-neutral-900 relative overflow-x-hidden flex flex-col">
      {/* Navbar fixa */}
      <Navbar />

      {/* Marca d’água de pata no fundo */}
      <div className="absolute inset-0 flex justify-center items-center">
        <PawPrint className="w-[80%] sm:w-[60%] lg:w-[40%] text-amber-900/10" />
      </div>

      {/* Conteúdo principal */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        <section className="space-y-16">
          {/* Nossa missão */}
          <div>
            <h2 className="text-4xl font-bold mb-4">Nossa missão</h2>
            <p className="text-lg leading-relaxed">
              Facilitar o acesso a{" "}
              <span className="text-amber-700 font-semibold">ONGs</span> de adoção
              e aproximar pessoas que desejam adotar com responsabilidade,
              garantindo que cada pet encontre um lar cheio de{" "}
              <span className="text-amber-700 font-semibold">amor</span>.
            </p>
          </div>

          {/* Quem somos */}
          <div>
            <h2 className="text-4xl font-bold mb-4">Quem somos?</h2>
            <p className="text-lg leading-relaxed mb-2">
              O{" "}
              <span className="text-amber-700 font-semibold">adopet.me</span> nasceu com
              o objetivo de ser uma{" "}
              <span className="text-amber-700 font-semibold">vitrine</span> simples e
              acessível para adoção de pets.
            </p>
            <p className="text-lg leading-relaxed">
              Queremos reunir em um só lugar as principais{" "}
              <span className="text-amber-700 font-semibold">ONGs</span> de proteção
              animal, tornando o processo de encontrar e adotar um amigo de quatro
              patas mais rápido, transparente e seguro.
            </p>
          </div>

          {/* Nossos valores */}
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Nossos <span className="text-amber-700">valores</span>
            </h2>
            <ul className="list-disc list-inside space-y-2 text-lg leading-relaxed">
              <li>Amor e respeito pelos animais.</li>
              <li>Adoção responsável acima de tudo.</li>
              <li>Transparência no processo com as ONGs parceiras.</li>
              <li>Facilidade para quem deseja adotar.</li>
              <li>
                Transformação social através da empatia e do cuidado.
              </li>
            </ul>
          </div>
        </section>
      </main>

      {/* Rodapé com logo */}
      <footer className="relative z-10 flex justify-end items-end px-8 py-6">
        <div className="flex flex-col items-center">
          <img
            src="/logo.png" // 🔸 Substitua pelo caminho real da sua logo
            alt="Logo adopet.me"
            className="w-20 h-20 object-contain"
          />
          <span className="font-semibold text-neutral-700">adopet.me</span>
        </div>
      </footer>
    </div>
  );
};

export default AboutUsPage;
