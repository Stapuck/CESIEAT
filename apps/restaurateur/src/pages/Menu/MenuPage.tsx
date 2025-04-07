import { Link } from "react-router-dom";
import GalleryMenu from "../../components/GalleryMenu";
import PlusIcon from "@assets/icons/plus.app.svg";

const MenuPage = () => {
  return (
    <div className="mt-25 ml-5">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des Menus</h1>
      <div className="">
        <Link
          to="/restaurateur/create-menu"
          className="flex items-center bg-tertiary text-white hover:bg-white hover:text-tertiary font-bold py-2 px-4 w-50 rounded   transition duration-300 mt-5"
        >
          <img className="w-5 mr-2" src={PlusIcon} alt="PlusIcon"/>
          Créer un menu
        </Link>
      </div>

      <GalleryMenu />
    </div>
  );
};

export default MenuPage;
