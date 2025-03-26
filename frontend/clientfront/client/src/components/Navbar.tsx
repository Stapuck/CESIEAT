import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import FavoriteLogo from "../assets/favorite.svg";
import PanierLogo from "../assets/panier.svg";
import CompteLogo from "../assets/account_circle.svg";


const Navbar = () => {
    return (
        <nav className="bg-default-background flex items-center">
            <div className="container flex mx-auto p-2 items-center">
                <img src={LogoCESIEAT} alt="Logo" className="" />
                <Link to='/'><h2 className="text-black font-navbar text-2xl font-bold ml-3.5">CHEF</h2></Link>
            </div>

            <div className=" flex flex-col justify-center items-center p-2">
                <img src={FavoriteLogo} alt="Logo" className="w-7" />
                <Link to='/'><h2 className="text-black font-navbar text-xs ">Favoris</h2></Link>
            </div>
            <div className=" flex flex-col justify-center items-center p-2">
                <img src={PanierLogo} alt="Logo" className="w-7" />

                <Link to='/'><h2 className="text-black font-navbar text-xs ">Panier</h2></Link>
            </div>
            <div className=" flex flex-col justify-center items-center p-2">
                <img src={CompteLogo} alt="Logo" className="w-7" />

                <Link to='/'><h2 className="text-black font-navbar text-xs ">Compte</h2></Link>
            </div>
        </nav>
    )
}

export default Navbar;