// adopetme-frontend/src/pages/LoginPage.tsx (MODIFICADO - VERSÃO FINAL DE INTEGRAÇÃO)

import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FcGoogle } from "react-icons/fc";
import { login } from "../services/AuthService";
import { useSession } from "../context/SessionContext"; 
import { Loader2 } from 'lucide-react'; 
import { FaPaw, FaUsers } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useSession(); 
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  const [localSelection, setLocalSelection] = useState<'TUTOR' | 'ONG'>('TUTOR');
  
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 🚨 Chamada ao serviço que envia o JSON para o Backend
      const { token } = await login(email, password); 
      
      setSession('LOGGED_IN', token, email);
      
      // Simulação: Guardar o role mockado até implementarmos um endpoint de perfil
      localStorage.setItem("user_role_mock", localSelection);
      
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        // Exibe a mensagem de erro detalhada retornada pelo backend (ex: "Senha incorreta.")
        setError(error.message);
      } else {
        setError("Erro desconhecido ao fazer login.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRedirect = () => {
    window.location.href = "http://localhost:8081/oauth2/authorization/google";
  }

  const handleGoogleLogin = () => {
    handleGoogleRedirect();
  }

  return (
    <div className="min-h-screen w-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow flex justify-center items-start py-12">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-black">Bem-Vindo de Volta!</h1>

          {/* Botões de Seleção de Perfil (Para fins de UX/IHC) */}
          <div className="flex items-center justify-center gap-6 mb-6">
              <button
                  type="button"
                  onClick={() => setLocalSelection('ONG')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${localSelection === 'ONG' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
              >
                  <FaUsers className="w-5 h-5" style={{ color: localSelection === 'ONG' ? '#ffffff' : undefined }} />
                  <span className="font-semibold">ONG</span>
              </button>
              <button
                  type="button"
                  onClick={() => setLocalSelection('TUTOR')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-amber-600 transition duration-200 ${localSelection === 'TUTOR' ? 'bg-amber-600 text-white shadow-md' : 'bg-white text-black hover:bg-amber-50'}`}
              >
                  <FaPaw className="w-5 h-5" style={{ color: localSelection === 'TUTOR' ? '#ffffff' : undefined }} />
                  <span className="font-semibold">Tutor</span>
              </button>
          </div>
          
          {error && <div className="text-red-600 mb-4 text-sm text-center bg-red-100 p-2 rounded border border-red-200">{error}</div>}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 border-yellow-600/50 p-3 rounded focus:outline-none text-black placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-950">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="accent-yellow-600"
                />
                Lembrar senha
              </label>
              <span
                className="text-yellow-600 hover:underline cursor-pointer"
                onClick={() => navigate("/recuperar-senha")}
              >
                Esqueci minha senha
              </span>
            </div>

            <button
              type="submit"
              className="bg-amber-800 text-white py-3 rounded font-bold hover:bg-amber-900 transition shadow-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {loading ? 'Entrando...' : 'Login'}
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border p-3 rounded-md mt-4 w-full border-gray-300 hover:bg-gray-100 transition font-semibold"
          >
            <FcGoogle size={20} />
            Entrar com Google
          </button>

          <p className="text-center mt-4 text-sm text-neutral-950">
            Não tem uma conta?{" "}
            <span
              className="text-yellow-600 hover:underline cursor-pointer"
              onClick={() => navigate("/registro")}
            >
              Registre-se
            </span>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;