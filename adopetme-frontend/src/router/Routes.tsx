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
// 3. Importar a página de denúncia
import ReportPage from '../pages/ReportPage';
// 4. Importar a página de gerenciamento
import ManageOngPage from '../pages/ManageOngPage'; 
// 5. IMPORTAR A NOVA PÁGINA DE EDIÇÃO
import EditPetPage from '../pages/EditPetPage';
// 6. IMPORTAR A PÁGINA DE FAVORITOS (AQUI ESTAVA A PARTE QUE FALTAVA)
import FavoritosPage from '../pages/FavoritosPage';


const NotFoundPage = () => <div className="p-10 text-center text-3xl font-bold text-red-600">404 - Página Não Encontrada</div>;

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
      
      {/* Rota de Denúncia */}
      <Route path="/report" element={<ReportPage />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/auth/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      
      {/* 7. ADICIONAR A NOVA ROTA DE FAVORITOS (AQUI ESTAVA A LINHA FALTANTE) */}
      <Route path="/favoritos" element={<FavoritosPage />} />

      {/* Rotas de ONG */}
      <Route path="/register-pet" element={<PetRegistrationPage />} />
      <Route path="/manage-ong" element={<ManageOngPage />} /> 
      
      <Route path="/edit-pet/:id" element={<EditPetPage />} />

      {/* Rota Curinga para 404 (qualquer caminho não mapeado) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;