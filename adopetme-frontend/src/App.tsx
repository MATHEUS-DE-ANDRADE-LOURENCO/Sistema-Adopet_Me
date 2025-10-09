import React from 'react';
// 👈 Importa o componente que contém a definição das rotas
import AppRoutes from './router/Routes'; 

/**
 * App é o componente raiz, responsável por definir o layout principal
 * e carregar o roteador do aplicativo.
 */
const App: React.FC = () => {
  return (
    // 💡 O container principal (você pode adicionar Context Providers aqui se precisar)
    <div className="min-h-screen bg-stone-50 antialiased font-sans">
      
      {/* O componente AppRoutes que contém todos os caminhos e páginas */}
      <AppRoutes />
      
    </div>
  );
};

export default App;
