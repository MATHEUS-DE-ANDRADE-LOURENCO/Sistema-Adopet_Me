import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorks';
import Footer from '../components/Footer';


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

      {/* Rodapé com logo */}
      <Footer />
    </div>
  );
};


export default HomePage;