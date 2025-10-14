import React from "react";
import { Link } from "react-router-dom";
import logo_without_title from "../assets/logo_without_title.png"

const Footer: React.FC = () => {

    const baseClasses =
    "no-underline !text-neutral-50 visited:!text-neutral-50 hover:!text-gray-200 focus:!text-neutral-50 active:!text-neutral-50 font-medium transition duration-150 p-2 rounded-lg";
    
    return (
      <footer className="w-full bg-yellow-600 text-white py-6 text-center md:text-left">
        <ul className="flex flex-col md:flex-row md:justify-between items-center gap-4 list-none m-0 p-0 w-full max-w-6xl mx-auto">
          <li> {/* Adiciona a logo no footer */}
              <img
                src={logo_without_title}
                alt="Logo adopet.me"
                className="w-20 h-20 object-contain"
              />
          </li>

          {/* Direitos Autorais */}
          <li>&copy; {new Date().getFullYear()} adopet.me - Todos os direitos reservados</li>
        
          {/* Sobre nós */}
          <li>
            <Link to="/about-us" 
            className={baseClasses}>
                Saiba Mais
            </Link>
          </li>

          {/* Denuncie */}
          <li>
            <Link to="/report" 
            className={baseClasses}>
                Denuncie
            </Link>
          </li>
        </ul>
      </footer>
    );
};
export default Footer;
