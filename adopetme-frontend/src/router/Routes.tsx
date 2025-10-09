import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';
import AboutUsPage from '../pages/AboutUsPage';

// Desconsiderar: Estas são páginas de espaço reservado simples.
// Você substituirá essas definições por componentes reais conforme avança no desenvolvimento.
// Assinado: Murillo Cardoso :P
const LoginPage = () => <div className="p-10 text-center text-xl font-semibold">Página de Login</div>;
const RegisterPage = () => <div className="p-10 text-center text-xl font-semibold">Página de Registro</div>;
const NotFoundPage = () => <div className="p-10 text-center text-3xl font-bold text-red-600">404 - Página Não Encontrada</div>;

// Esse componente define todas as rotas do aplicativo.
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rota Padrão (Homepage) */}
      <Route path="/" element={<HomePage />} />
      
      {/* Rotas de Navegação */}
      <Route path="/search" element={<SearchPage />} />
      <Route path="/about-us" element={<AboutUsPage />} />
      
      {/* Rotas de Autenticação */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rota Curinga para 404 (qualquer caminho não mapeado) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
