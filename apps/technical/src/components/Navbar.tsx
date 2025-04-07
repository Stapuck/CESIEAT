import { Link } from "react-router-dom";
import LogoCESIEAT from "@assets/logo.svg";
import CompteLogo from "@assets/icons/person.crop.circle.svg";
import { useAuth } from "react-oidc-context";
import LoginButton from "./LoginButton";

const Navbar = () => {
    const auth = useAuth(); // Utiliser le hook pour accéder aux informations d'authentification
    
    // Récupérer le prénom de l'utilisateur ou utiliser "Compte" par défaut
    const userName = auth.user?.profile.given_name || "Compte";

    return (
        <nav className="bg-default-background font-Inter shadow-gray-500 shadow-2xl z-50 fixed w-full top-0 flex items-center">
            <div className="container mx-auto p-2 items-center flex">
                <Link to="/technical" className="flex items-center">
                    <img src={LogoCESIEAT} alt="Logo" className="" />
                    <h2 className="text-black font-Inter text-2xl font-extrabold ml-3.5">CHEF</h2>
                </Link>
            </div>

            <div className="flex p-2 hover:cursor-pointer f hover:scale-110 transition-transform duration-200">
                <Link to="/technical/account" className="flex flex-col justify-center items-center">
                    <img src={CompteLogo} alt="Compte" className="h-7 w-7 mb-1" />
                    <h2 className="text-black font-Inter text-xs">{userName}</h2>
                </Link>
            </div>
            <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                <LoginButton />
            </div>
        </nav>
    );
};  

export default Navbar;