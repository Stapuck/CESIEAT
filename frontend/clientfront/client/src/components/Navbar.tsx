import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import FavoriteLogo from "../assets/icons/heart.fill.svg";
import PanierLogo from "../assets/icons/cart.fill.svg";
import CompteLogo from "../assets/icons/person.crop.circle.svg";
import { useCart } from "../context/CartContext";
import LoginButton from "./LoginButton";
import { useAuth } from "react-oidc-context";
import { useState } from "react";

const Navbar = () => {
  const { cartItems } = useCart(); // Utiliser le hook pour accéder au panier
  const auth = useAuth(); // Utiliser le hook pour accéder aux informations d'authentification
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Récupérer le prénom de l'utilisateur ou utiliser "Compte" par défaut
  const userName = auth.user?.profile.given_name || "Compte";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-default-background font-Inter shadow-gray-500 shadow-2xl z-50 fixed w-full top-0">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        {/* Logo */}
        <Link to="/client" className="flex items-center">
          <img src={LogoCESIEAT} alt="Logo" className="" />
          <h2 className="text-black font-Inter text-2xl font-extrabold ml-3.5">
            CHEF
          </h2>
        </Link>

        {/* Bouton hamburger pour mobile */}
        <button 
          className="md:hidden text-black p-2" 
          onClick={toggleMenu}
          aria-label="Menu"
        >
          <svg 
            className="w-6 h-6" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Navigation pour desktop - toujours visible sur md et plus */}
        <div className="hidden md:flex items-center">
          <NavItem to="/client/favoris" icon={FavoriteLogo} text="Favoris" />
          <NavItem 
            to="/client/cart" 
            icon={PanierLogo} 
            text="Panier" 
            badge={cartItems.length > 0} 
          />
          <NavItem to="/client/account" icon={CompteLogo} text={userName} />
          <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200">
            <LoginButton />
          </div>
        </div>
      </div>

      {/* Menu mobile - s'affiche uniquement quand isMenuOpen est true */}
      {isMenuOpen && (
        <div className="md:hidden bg-default-background pb-4">
          <NavItem to="/client/favoris" icon={FavoriteLogo} text="Favoris" mobile />
          <NavItem 
            to="/client/cart" 
            icon={PanierLogo} 
            text="Panier" 
            badge={cartItems.length > 0} 
            mobile 
          />
          <NavItem to="/client/account" icon={CompteLogo} text={userName} mobile />
          <div className="flex justify-center p-2">
            <LoginButton />
          </div>
        </div>
      )}
    </nav>
  );
};

// Composant pour les éléments de navigation (pour éviter la répétition)
const NavItem = ({ to, icon, text, badge = false, mobile = false }) => {
  return (
    <div className={`flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200 relative ${mobile ? 'justify-center w-full' : ''}`}>
      <Link
        to={to}
        className="flex flex-col justify-center items-center"
      >
        <img src={icon} alt={text} className="h-7 w-7 mb-1" />
        <h2 className="text-black font-Inter text-xs">{text}</h2>
      </Link>
      {badge && (
        <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
      )}
    </div>
  );
};

export default Navbar;
