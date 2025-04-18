import { Link } from "react-router-dom";
import LogoCESIEAT from "../assets/logo.svg";
import LoginButton from "./LoginButton";

const Navbar = () => {

    return (
        <nav className="bg-default-background font-Inter shadow-gray-500 shadow-2xl z-50 fixed w-full top-0 flex items-center">
            <div className="container mx-auto p-2 items-center flex">
                <Link to="/commercial" className="flex items-center">
                    <img src={LogoCESIEAT} alt="Logo" className="" />
                    <h2 className="text-black font-Inter text-2xl font-extrabold ml-3.5">CHEF</h2>
                </Link>
            </div>

            <div className="flex p-2 hover:cursor-pointer hover:scale-110 transition-transform duration-200">
                <LoginButton />
            </div>
        </nav>
    );
};  

export default Navbar;