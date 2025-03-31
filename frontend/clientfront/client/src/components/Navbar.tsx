import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import FavoriteLogo from "../assets/icons/heart.fill.svg";
import PanierLogo from "../assets/icons/cart.fill.svg";
import CompteLogo from "../assets/icons/person.crop.circle.svg";
import { useCart } from "../context/CartContext";

const Navbar = () => {
    const { cartItems } = useCart(); // Utiliser le hook pour accéder au panier

    return (
        <nav className="bg-default-background font-Inter shadow-gray-500 shadow-2xl z-50 fixed w-full top-0 flex items-center">
            <div className="container mx-auto p-2 items-center flex">
                <Link to="/client" className="flex items-center">
                    <img src={LogoCESIEAT} alt="Logo" className="" />
                    <h2 className="text-black font-Inter text-2xl font-extrabold ml-3.5">CHEF</h2>
                </Link>
            </div>

            <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                <Link to="/client/favoris" className="flex flex-col justify-center items-center">
                    <img src={FavoriteLogo} alt="Favoris" className="h-7 w-7 mb-1" />
                    <h2 className="text-black font-Inter text-xs">Favoris</h2>
                </Link>
            </div>
            <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200 relative">
                <Link to="/client/cart" className="flex flex-col justify-center items-center">
                    <img src={PanierLogo} alt="Panier" className="h-7 w-7 mb-1" />
                    <h2 className="text-black font-Inter text-xs">Panier</h2>
                </Link>
                {cartItems.length > 0 && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
            </div>
            <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                <Link to="/client" className="flex flex-col justify-center items-center">
                    <img src={CompteLogo} alt="Compte" className="h-7 w-7 mb-1" />
                    <h2 className="text-black font-Inter text-xs">Compte</h2>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;