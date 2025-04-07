import { Link, useLocation } from "react-router-dom";
import IconArtcile from "@assets/icons/list.bullet.clipboard.fill.svg";
import IconMenus from "@assets/icons/list.bullet.svg";
import IconCommande from "@assets/icons/cart.fill.svg";
import IconHistorique from "@assets/icons/clock.arrow.trianglehead.counterclockwise.rotate.90.svg";


type SidebarProps = {
  isSidebarOpen: boolean;
};

const Sidebar = ({ isSidebarOpen }: SidebarProps) => {
  const location = useLocation();

  const getLinkClassName = (path: string) => {
    return location.pathname === path
      ? "flex items-center space-x-2 py-3 pr-5  rounded text-white font-semibold"
      : "flex items-center space-x-2 py-3 pr-5  rounded text-black ";
  };

  return (
    <div
      className={`w-64 fixed left-0 bg-secondary text-black p-4 transition-all h-full z-1 mt-20 duration-300 ${
        isSidebarOpen ? "block" : "hidden lg:block"
      }`}
    >
      <nav className="z-1 text-black">
        <ul className="space-y-2 space-x-0">

          <li className="flex justify-start items-center text-black ">
            <Link to="/restaurateur/article" className={getLinkClassName("/restaurateur/article")}>
              <img src={IconArtcile} alt="ArticleIcon" className="w-4 mr-1" /> <span className="ml-1">Mes Articles</span>
            </Link>
          </li>
          <li className="flex justify-start items-center">
            <Link to="/restaurateur/menu" className={getLinkClassName("/restaurateur/menu")}>
            <img src={IconMenus} alt="MenusIcon" className="w-5 mr-2" /> <span>Mes Menus</span>
            </Link>
          </li>
          <li className="flex justify-start items-center">
            <Link to="/restaurateur/commande" className={getLinkClassName("/restaurateur/commande")}>
            <img src={IconCommande} alt="CommandeIcon" className="w-5 mr-2" /> <span>Mes Commandes</span>
            </Link>
          </li>
          <li className="flex justify-start items-center">
            <Link to="/restaurateur/historique" className={getLinkClassName("/restaurateur/historique")}>
            <img src={IconHistorique} alt="HistoryIcon" className="w-5 mr-2" /> <span>Mon Historique</span>
            </Link>
          </li>

        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;