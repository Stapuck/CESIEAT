import { useState } from "react";
import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import CompteLogo from "../assets/icons/person.crop.circle.svg";
import { useAuth } from "react-oidc-context";
import LoginButton from "./LoginButton";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
    const auth = useAuth();
    const userName = auth.user?.profile.given_name || "Compte";
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav className="bg-default-background font-Inter shadow-gray-500 shadow-lg z-50 fixed w-full top-0">
            <div className="container mx-auto flex flex-wrap items-center justify-between px-4 py-3">
                {/* Logo - toujours visible */}
                <Link to="/livreur" className="flex items-center">
                    <img src={LogoCESIEAT} alt="Logo" className="h-8" />
                    <h2 className="text-black font-Inter text-xl md:text-2xl font-extrabold ml-2 md:ml-3.5">CHEF</h2>
                </Link>

                {/* Bouton hamburger - visible uniquement sur mobile */}
                <div className="block md:hidden">
                    <button 
                        onClick={toggleMenu}
                        className="flex items-center p-2 rounded hover:bg-gray-100"
                    >
                        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </div>

                {/* Menu de navigation - adapté selon la taille d'écran */}
                <div className={`w-full md:flex md:w-auto md:items-center ${menuOpen ? 'block' : 'hidden'} mt-4 md:mt-0`}>
                    <div className="flex flex-col md:flex-row md:items-center">
                        {/* Compte utilisateur */}
                        <Link 
                            to="/livreur/account" 
                            className="flex items-center p-3 hover:bg-gray-100 rounded-lg mb-2 md:mb-0 md:mr-4"
                            onClick={() => setMenuOpen(false)}
                        >
                            <img src={CompteLogo} alt="Compte" className="h-6 w-6 mr-2" />
                            <span className="text-black font-Inter text-sm">{userName}</span>
                        </Link>
                        
                        {/* Bouton de connexion */}
                        <div className="flex p-2">
                            <LoginButton />
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;