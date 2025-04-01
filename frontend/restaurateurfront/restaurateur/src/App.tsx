import { Link, Route, Routes, useLocation } from "react-router-dom";
import {
  FaBars,
  FaFileAlt,
  FaHistory,
  FaList,
  FaShoppingCart,
  FaUser,
} from "react-icons/fa"; // Icons
import { useState } from "react";
import HomePage from "./pages/HomePage";
import TestPage from "./pages/TestPage";
import NotFoundPage from "./components/NotFoundPage";
import { ToastContainer } from "react-toastify";
import CreateArticle from "./pages/Article/CreateArticle";
import CreateMenu from "./pages/Menu/CreateMenu";
import EditArticle from "./pages/Article/EditArticle";
import EditMenu from "./pages/Menu/EditMenu";
import MenuPage from "./pages/Menu/MenuPage";
import ArticlePage from "./pages/Article/ArticlePage";
import HistoriqueCommande from "./pages/Commande/HistoriqueCommande";
import CommandePage from "./pages/Commande/CommandePage";
import CreateCommande from "./pages/Commande/CreateCommande";
import Protected from "./pages/Protected";
import LoginButton from "./components/LoginButton";

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Ajouter l'état pour la sidebar

  const getLinkClassName = (path: string) => {
    // Vérifie si le chemin actuel correspond à celui du lien
    return location.pathname === path
      ? "flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-white font-semibold"
      : "flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-gray-400";
  };

  return (
    <div className="bg-white flex flex-col h-screen">
      {/* Navbar */}
      <nav className="bg-gray-800 flex items-center justify-between p-4">
        <Link to="/home" className="text-white text-2xl font-bold">
          Restaurateur Front
        </Link>

        {/* Button to toggle sidebar */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)} // Toggle sidebar
          className="text-white lg:hidden"
        >
          <FaBars size={24} />
        </button>
      </nav>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className={`w-fit bg-gray-800 text-white p-4 transition-all duration-300 ${
            isSidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          <nav>
            <ul>
              <li>
                <Link to="restaurateur/account" className={getLinkClassName("/account")}>
                  <FaUser /> <span>Mon Compte</span>{" "}
                  {/* {isSidebarOpen ? ('') : (<span>Mon Compte</span>)} */}
                </Link>
              </li>
              <li>
                <Link to="restaurateur/menu" className={getLinkClassName("/menu")}>
                  <FaList /> <span>Mes Menu</span>
                </Link>
              </li>
              <li>
                <Link to="restaurateur/article" className={getLinkClassName("/article")}>
                  <FaFileAlt /> <span>Mes Articles</span>
                </Link>
              </li>
              <li>
                <Link to="restaurateur/commande" className={getLinkClassName("/commande")}>
                  <FaShoppingCart /> <span>Mes Commandes</span>
                </Link>
              </li>
              <li>
                <Link
                  to="restaurateur/historique"
                  className={getLinkClassName("/historique")}
                >
                  <FaHistory /> <span>Mon Historique</span>
                </Link>
              </li>
              <li>
                <LoginButton></LoginButton>
              </li>
            </ul>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="/restaurateur" element={<HomePage />} />
            {/* <Route path="/restaurateur/" element={<HomePage />} /> */}

            {/* article */}
            <Route element={<Protected />}>
              <Route path="/restaurateur/create-article" element={<CreateArticle />} />
              <Route path="/restaurateur/edit-article/:id" element={<EditArticle />} />
              <Route path="/restaurateur/create-menu" element={<CreateMenu />} />
              <Route path="/restaurateur/edit-menu/:id" element={<EditMenu />} />
              <Route path="/restaurateur/menu" element={<MenuPage />} />
              <Route path="/restaurateur/article" element={<ArticlePage />} />
              <Route path="/restaurateur/commande" element={<CommandePage />} />
              <Route path="/restaurateur/historique" element={<HistoriqueCommande />} />
              <Route path="/restaurateur/create-commande" element={<CreateCommande />} />
            </Route>

            <Route path="/test" element={<TestPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
