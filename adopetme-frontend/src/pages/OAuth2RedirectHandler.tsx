// adopetme-frontend/src/pages/OAuth2RedirectHandler.tsx

import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";
import { Loader2 } from 'lucide-react';

const OAuth2RedirectHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setSession } = useSession();

  useEffect(() => {
    // 1. Extrai o token e o erro da URL
    const token = searchParams.get("token");
    const error = searchParams.get("error");
    // O email é necessário para o Navbar, mas o backend APENAS envia o token por padrão.
    // Se você modificar o backend (Passo 3 abaixo), o email virá aqui:
    const email = searchParams.get("email"); 

    if (token) {
      // 2. Salva a sessão no contexto (com o email, se existir)
      setSession('LOGGED_IN', token, email);
      
      // Assumindo uma role para a lógica de navegação funcionar
      localStorage.setItem("user_role_mock", "USER"); 

      // 3. Redireciona para a página principal
      navigate("/", { replace: true });

    } else if (error) {
      // 4. Em caso de erro, redireciona para a página de login com a mensagem de erro
      console.error("OAuth2 Login Falhou:", error);
      navigate("/login", { state: { error: `Login com Google falhou: ${error}` } });
    
    } else {
      // 5. Caso inesperado
      navigate("/login", { state: { error: "Login com Google falhou devido a um erro desconhecido." } });
    }
  }, [searchParams, navigate, setSession]);

  // Exibe um loading enquanto o processamento ocorre
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Loader2 className="w-12 h-12 animate-spin text-yellow-600 mb-4" />
      <h1 className="text-xl font-semibold text-neutral-800">Processando login com Google...</h1>
      <p className="text-sm text-gray-500 mt-2">Aguarde um momento, por favor.</p>
    </div>
  );
};

export default OAuth2RedirectHandler;