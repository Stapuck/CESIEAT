import { Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./components/NotFoundPage";
import Account from "./pages/Account";
import CreateArticle from "./pages/Article/CreateArticle";
import EditArticle from "./pages/Article/EditArticle";
import CreateMenu from "./pages/Menu/CreateMenu";
import EditMenu from "./pages/Menu/EditMenu";
import MenuPage from "./pages/Menu/MenuPage";
import ArticlePage from "./pages/Article/ArticlePage";
import HistoriqueCommande from "./pages/Commande/HistoriqueCommande";
import CommandePage from "./pages/Commande/CommandePage";
import Protected from "./pages/Protected";
import CreateRestaurant from "./pages/CreateRestaurant";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="restaurateur/" element={<HomePage />} />
          <Route element={<Protected />}>
            <Route path="restaurateur/account" element={<Account />} />
            <Route path="restaurateur/menu" element={<MenuPage />} />
            <Route path="restaurateur/article" element={<ArticlePage />} />
            <Route path="restaurateur/commande" element={<CommandePage />} />
            <Route path="restaurateur/create-restaurant" element={<CreateRestaurant />} />
            <Route
              path="restaurateur/historique"
              element={<HistoriqueCommande />}
            />
            <Route
              path="restaurateur/create-article"
              element={<CreateArticle />}
            />
            <Route
              path="restaurateur/edit-article/:id"
              element={<EditArticle />}
            />
            <Route path="restaurateur/create-menu" element={<CreateMenu />} />
            <Route path="restaurateur/edit-menu/:id" element={<EditMenu />} />
            
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
