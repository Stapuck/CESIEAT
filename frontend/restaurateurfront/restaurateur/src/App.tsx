import { Link, Route, Routes, useLocation  } from "react-router-dom";
import { FaUser, FaList, FaFileAlt, FaShoppingCart, FaHistory, FaBars } from "react-icons/fa"; // Icons
import { useState, useEffect } from "react";
import { createZitadelAuth, ZitadelConfig } from "@zitadel/react";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import { ToastContainer } from 'react-toastify';
import CreateArticle from "./pages/Article/CreateArticle";
import CreateMenu from "./pages/Menu/CreateMenu";
import Login from "./components/Login";
import Callback from "./components/Callback";
import Account from "./pages/Account";
import EditArticle from "./pages/Article/EditArticle";
import EditMenu from "./pages/Menu/EditMenu";
import MenuPage from "./pages/Menu/MenuPage";
import ArticlePage from "./pages/Article/ArticlePage";
import HistoriqueCommande from "./pages/Commande/HistoriqueCommande";
import CommandePage from "./pages/Commande/CommandePage";
import CreateCommande from "./pages/Commande/CreateCommande";

function App() {
  const config: ZitadelConfig = {
    authority: "https://instance1-el5q1i.zitadel.cloud/",
    client_id: "312751992336403117",
    redirect_uri: "http://localhost:5173/callback",
    post_logout_redirect_uri: "http://localhost:5173/"
  };

  const zitadel = createZitadelAuth(config);
  
  function login() {
    zitadel.authorize();
  }

  function signout() {
    zitadel.signout();
  }

  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Ajouter l'état pour la sidebar

  useEffect(() => {
    zitadel.userManager.getUser().then((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
  }, [zitadel]);

  const location = useLocation();
  
  const getLinkClassName = (path : string) => {
    // Vérifie si le chemin actuel correspond à celui du lien
    return location.pathname === path
      ? 'flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-white font-semibold' 
      : 'flex items-center space-x-2 py-3 hover:bg-gray-700 rounded text-gray-400'; 
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
            isSidebarOpen ? 'block' : 'hidden lg:block'
          }`}
        >
          <nav>
            <ul>
              <li>
                <Link to="restaurateur/account" className={getLinkClassName('restaurateur/account')}>
                   <FaUser /> <span>Mon Compte</span> {/* {isSidebarOpen ? ('') : (<span>Mon Compte</span>)} */}
                </Link>
              </li>
              <li>
                <Link to="restaurateur/menu" className={getLinkClassName('restaurateur/menu')}>
                  <FaList /> <span>Mes Menu</span>
                </Link>
              </li>
              <li>
                <Link to="restaurateur/article" className={getLinkClassName('restaurateur/article')}>
                  <FaFileAlt /> <span>Mes Articles</span>
                </Link>
              </li>
              <li>
                <Link to="restaurateur/commande" className={getLinkClassName('restaurateur/commande')}>
                  <FaShoppingCart /> <span>Mes Commandes</span>
                </Link>
              </li>
              <li>
                <Link to="restaurateur/historique" className={getLinkClassName('restaurateur/historique')}>
                  <FaHistory /> <span>Mon Historique</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>

  
        {/* Mobile Sidebar (hidden on large screens)
        <div
          className={`lg:hidden w-16 bg-gray-800 text-white flex flex-col items-center space-y-4 py-8 transition-all duration-300 ${
            isSidebarOpen ? 'block' : 'hidden'
          }`}
        >
          <Link to="/account" className="flex flex-col items-center space-y-2">
          <FaUser size={24} />
            <span className="text-xs">Account</span>
          </Link>
          <Link to="/create-menu" className="flex flex-col items-center space-y-2">
            <FaList size={24} />
            <span className="text-xs">Menu</span>
          </Link>
          <Link to="/create-article" className="flex flex-col items-center space-y-2">
            <FaFileAlt size={24} />
            <span className="text-xs">Article</span>
          </Link>
          <Link to="/test" className="flex flex-col items-center space-y-2">
            <FaShoppingCart size={24} />
            <span className="text-xs">Commande</span>
          </Link>
          <Link to="/home" className="flex flex-col items-center space-y-2">
            <FaHistory size={24} />
            <span className="text-xs">Historique</span>
          </Link>
        </div> */}

        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <Routes>
            <Route path="restaurateur/" element={<Login authenticated={authenticated} handleLogin={login} />} />
            <Route path="restaurateur/callback" element={<Callback authenticated={authenticated} setAuth={setAuthenticated} handleLogout={signout} userManager={zitadel.userManager} />} />
            <Route path="restaurateur/home" element={<HomePage />} />
            <Route path="/restaurateur/" element={<HomePage />} />
            {/* article */}
            <Route path='restaurateur/create-article' element={<CreateArticle />} />
            <Route path='restaurateur/edit-article/:id' element={<EditArticle />} />
            {/* menu */}
            <Route path='restaurateur/create-menu' element={<CreateMenu />} />
            <Route path='restaurateur/edit-menu/:id' element={<EditMenu />} />

            {/* provisoir */}
            <Route path='restaurateur/create-commande' element={<CreateCommande/>} />

            <Route path='restaurateur/account' element={<Account authenticated={authenticated} setAuth={setAuthenticated} userManager={zitadel.userManager} />} />
            <Route path="restaurateur/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="restaurateur/menu" element={<MenuPage />} />
            <Route path="restaurateur/article" element={<ArticlePage />} />
            <Route path="restaurateur/commande" element={<CommandePage />} />
            <Route path="restaurateur/historique" element={<HistoriqueCommande />} />

          </Routes>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
