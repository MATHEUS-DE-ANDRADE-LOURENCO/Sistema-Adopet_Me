import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorks';


const HomePage: React.FC = () => {
  return (
    <div className="w-screen flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Conteúdo principal */}
      <main className="flex justify-center flex-col">
        <HeroSection />
        <HowItWorksSection />
        {/* Você pode adicionar outras seções aqui */}
      </main>

      {/* Footer */}
      <footer className="w-full bg-yellow-600 text-white py-6 text-center">
        &copy; {new Date().getFullYear()} adopet.me - Todos os direitos reservados
      </footer>
    </div>
  );
};


export default HomePage;