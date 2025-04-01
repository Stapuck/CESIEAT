import { Link, useLocation } from "react-router-dom";
import { FaUser, FaList, FaFileAlt, FaShoppingCart, FaHistory } from "react-icons/fa";
import LoginButton from "./LoginButton";


type SidebarProps = {
  isSidebarOpen: boolean;
};

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const location = useLocation();

  const getLinkClassName = (path: string) => {
    return location.pathname === path
      ? "flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-white font-semibold"
      : "flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-gray-400";
  };

  return (
    <div
      className={`w-64 bg-gray-800 text-white p-4 transition-all duration-300 ${
        isSidebarOpen ? "block" : "hidden lg:block"
      }`}
    >
      <nav>
        <ul>
          <li>
            <Link to="/restaurateur/account" className={getLinkClassName("/restaurateur/account")}>
              <FaUser /> <span>Mon Compte</span>
            </Link>
          </li>
          <li>
            <Link to="/restaurateur/menu" className={getLinkClassName("/restaurateur/menu")}>
              <FaList /> <span>Mes Menus</span>
            </Link>
          </li>
          <li>
            <Link to="/restaurateur/article" className={getLinkClassName("/restaurateur/article")}>
              <FaFileAlt /> <span>Mes Articles</span>
            </Link>
          </li>
          <li>
            <Link to="/restaurateur/commande" className={getLinkClassName("/restaurateur/commande")}>
              <FaShoppingCart /> <span>Mes Commandes</span>
            </Link>
          </li>
          <li>
            <Link to="/restaurateur/historique" className={getLinkClassName("/restaurateur/historique")}>
              <FaHistory /> <span>Mon Historique</span>
            </Link>
          </li>
          <li>
            <LoginButton/>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;