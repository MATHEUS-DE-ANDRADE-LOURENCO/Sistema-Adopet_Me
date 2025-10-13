// src/pages/LoginPage.tsx
import React, { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FcGoogle } from "react-icons/fc";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrar, setLembrar] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    console.log("Email:", email, "Senha:", senha);
    navigate("/confirmacao");
  };

  const handleGoogleLogin = () => {
    console.log("Login com Google");
    navigate("/confirmacao");
  };

  return (
    <div className="min-h-screen w-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-xl text-neutral-950 font-bold mb-6 text-center">
            Bem-Vindo de Volta!
          </h1>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 border-yellow-600 text-neutral-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              className="border-2 border-yellow-600 text-neutral-950 p-2 rounded focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-950">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
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
              className="bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700 transition"
            >
              Login
            </button>
          </form>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 border p-2 rounded mt-4 w-full hover:bg-gray-100 transition"
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
    </div>
  );
};

export default LoginPage;
