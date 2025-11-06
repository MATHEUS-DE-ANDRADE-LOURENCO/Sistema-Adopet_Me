// adopetme-frontend/src/components/Navbar.tsx (MODIFICADO)
import React from "react";
import { PawPrint, User } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Buscar Pets", href: "/search" },
  { name: "Denúncias", href: "/report" },
  { name: "Sobre nós", href: "/about-us" }
];

const Navbar: React.FC = () => {
  const { session, setSession, userEmail } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    setSession('NONE', null, null);
    navigate('/');
  };

  const baseClasses =
    "no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 p-2 rounded-lg";
  const activeClasses = "font-bold";

  return (
    <nav className="bg-yellow-600 shadow-sm border-b border-amber-200/50 sticky top-0 z-20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-bold no-underline !text-neutral-50">
          <PawPrint className="w-8 h-8 text-amber-800" aria-hidden="true" />
          <span 
            className="no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 rounded-lg"
            >
            adopet.me
          </span>
        </Link>

        <div className="hidden sm:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.href}
              className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}
            >
              {link.name}
            </NavLink>
          ))}
          {/* NOVO: Adiciona link de Denúncia se necessário - mantido simples por enquanto */}
        </div>

        <div className="flex space-x-3 items-center">
          {/* 👈 Lógica de exibição baseada na sessão */}
          {session === 'NONE' ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold rounded-full !text-neutral-50 hover:!text-gray-200 bg-yellow-500 hover:bg-yellow-700 transition duration-200 no-underline"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-semibold rounded-full !text-neutral-50 hover:!text-gray-200 bg-yellow-500 hover:bg-yellow-700 transition duration-200 no-underline"
              >
                Registre-se
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white text-black">
                <User className="w-5 h-5 text-black" />
                <span className="text-sm font-medium"> {userEmail || 'Perfil Logado'}</span>
              </div>
              <button onClick={handleLogout} className="px-3 py-2 rounded-md bg-transparent border border-white text-white hover:bg-white/10">Sair</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;