import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import FavoriteLogo from "../assets/icons/heart.fill.svg";
import PanierLogo from "../assets/icons/cart.fill.svg";
import CompteLogo from "../assets/icons/person.crop.circle.svg";

const Navbar = () => {
    return (
        <nav className="bg-default-background font-Inter shadow-gray-500 shadow-2xl z-50 fixed w-full top-0 flex items-center">
            <div className="container flex mx-auto p-2 items-center">
                <img src={LogoCESIEAT} alt="Logo" className="" />
                <Link to="/">
                    <h2 className="text-black font-Inter text-2xl font-extrabold ml-3.5">CHEF</h2>
                </Link>
            </div>

            <div className="flex flex-col justify-center items-center p-2">
                <img src={FavoriteLogo} alt="Favoris" className="h-7 w-7 mb-1" />
                <Link to="/">
                    <h2 className="text-black font-Inter text-xs">Favoris</h2>
                </Link>
            </div>
            <div className="flex flex-col justify-center items-center p-2">
                <img src={PanierLogo} alt="Panier" className="h-7 w-7 mb-1" />
                <Link to="/">
                    <h2 className="text-black font-Inter text-xs">Panier</h2>
                </Link>
            </div>
            <div className="flex flex-col justify-center items-center p-2">
                <img src={CompteLogo} alt="Compte" className="h-7 w-7 mb-1" />
                <Link to="/">
                    <h2 className="text-black font-Inter text-xs">Compte</h2>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;