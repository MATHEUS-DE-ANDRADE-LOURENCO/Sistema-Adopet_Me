// adopetme-frontend/src/components/Navbar.tsx
import React from "react";
import { PawPrint, User, Home, Search, FilePenLine, Info, Users } from "lucide-react"; // Importa ícones
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../context/SessionContext";

// 1. Define os links base
const baseNavLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Denúncias", href: "/report", icon: FilePenLine },
  { name: "Sobre nós", href: "/about-us", icon: Info }
];

// 2. Define links específicos por role
const tutorLinks = [
  { name: "Buscar Pets", href: "/search", icon: Search },
];

const ongLinks = [
  { name: "Buscar Pets", href: "/search", icon: Search },
  { name: "Registrar Pet", href: "/register-pet", icon: PawPrint }, 
  { name: "Gerenciar ONG", href: "/manage-ong", icon: Users } // Link futuro
];


const Navbar: React.FC = () => {
  // 3. Pega a userRole do contexto
  const { session, setSession, userEmail, userRole } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    setSession('NONE', null, null, null); // Limpa a role no logout
    navigate('/');
  };
  
  // 4. Determina quais links mostrar
  const navLinks = React.useMemo(() => {
    let specificLinks = [];
    if (userRole === 'ADMIN_ONG') {
        specificLinks = ongLinks;
    } else { 
        // "Buscar Pets" agora é padrão para tutores E usuários deslogados
        specificLinks = tutorLinks;
    }
    
    // Insere os links específicos logo após "Home"
    const links = [
        { name: "Home", href: "/", icon: Home },
        ...specificLinks,
        { name: "Denúncias", href: "/report", icon: FilePenLine },
        { name: "Sobre nós", href: "/about-us", icon: Info }
    ];
    
    // Remove duplicatas se "Buscar Pets" já foi adicionado
    if (userRole === 'ADMIN_ONG') {
        return links.filter(link => link.name !== 'Buscar Pets');
    }
    return links;

  }, [userRole]); // Recalcula os links se a userRole mudar

  const baseClasses =
    "no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 p-2 rounded-lg flex items-center gap-1.5";
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

        {/* 5. Renderiza os links dinâmicos */}
        <div className="hidden sm:flex space-x-6 items-center">
          {navLinks.map((link) => (
            (session === 'LOGGED_IN' || !['Registrar Pet', 'Gerenciar ONG'].includes(link.name)) ? (
                <NavLink
                key={link.name}
                to={link.href}
                className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : ""}`}
                >
                <link.icon className="w-4 h-4" />
                {link.name}
                </NavLink>
            ) : null
          ))}
        </div>

        <div className="flex space-x-3 items-center">
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