import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorksSection from '../components/HowItWorks';


const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 antialiased font-sans">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
      </main>
    </div>
  );
};

export default HomePage;