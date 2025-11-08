// adopetme-frontend/src/router/Routes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AboutUsPage from '../pages/AboutUsPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import PetDetailsPage from '../pages/PetDetailsPage';
import LoginPage from '../pages/LoginPage';
import OAuth2RedirectHandler from '../pages/OAuth2RedirectHandler';

// 1. Importar a nova página de registro
import RegisterPage from '../pages/RegisterPage'; 
// 2. Importar a página de registro de pet
import PetRegistrationPage from '../pages/PetRegistrationPage';


const NotFoundPage = () => <div className="p-10 text-center text-3xl font-bold text-red-600">404 - Página Não Encontrada</div>;
// const AnimalRegistrationPage = () => ... // Removido

// Esse componente define todas as rotas do aplicativo.
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Padrão (Homepage) */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rotas de Navegação */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/search-results" element={<SearchResultsPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      <Route path="/pets/:id" element={<PetDetailsPage />} />
      <Route path="/report" element={<NotFoundPage />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      
      {/* 3. A rota agora usa o componente importado */}
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/auth/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      
      {/* 4. Adicionar a nova rota para ONGs */}
      <Route path="/register-pet" element={<PetRegistrationPage />} />
      {/* Rota futura (exemplo da Navbar) */}
      <Route path="/manage-ong" element={<NotFoundPage />} /> 

      {/* Rota Curinga para 404 (qualquer caminho não mapeado) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;