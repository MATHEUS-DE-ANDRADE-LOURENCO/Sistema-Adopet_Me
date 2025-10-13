import React from "react";
import { PawPrint, Bone, Heart } from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 flex justify-center items-start">
        <div className="w-3/4 h-3/4 bg-amber-200/30 rounded-full blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/4"></div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid md:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <div className="text-neutral-950 text-justify">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
            Encontre seu novo melhor amigo!
          </h1>
          <p className="text-xl sm:text-2xl mb-10 max-w-lg">
            Conectamos pessoas a ONGs de adoção de pets, de forma simples, rápida e responsável.
          </p>
          <button className="w-75 mx-auto block px-10 py-4 text-xl font-bold rounded-full !text-white !bg-amber-800 hover:!bg-amber-900 shadow-xl transition duration-300 transform hover:scale-[1.02]">
            Busque Ongs Já!
          </button>
        </div>

        {/* Ilustração */}
        <div className="flex justify-center items-center relative">
          <div className="flex space-x-4">
            <div className="p-8 bg-orange-500 rounded-2xl shadow-2xl relative">
              <Bone className="w-32 h-32 text-amber-800 transform rotate-12 -translate-y-4" />
              <PawPrint className="absolute bottom-4 right-4 w-12 h-12 text-amber-900/70" />
            </div>
            <div className="p-8 bg-amber-200 rounded-2xl shadow-2xl relative -mt-8">
              <PawPrint className="w-32 h-32 text-amber-800 transform -rotate-12 translate-y-4" />
              <Heart className="absolute top-4 left-4 w-12 h-12 text-red-500/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
