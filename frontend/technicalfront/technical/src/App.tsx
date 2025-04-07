import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";
import ApiDocumentationPage from "./pages/ApiDocumentationPage";
import ApiKeysPage from "./pages/ApiKeysPage";
import ApiUsagePage from "./pages/ApiUsagePage";
import EditProfilePage from "./pages/EditProfilePage";
import MyDownloadsPage from "./pages/MyDownloadsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import Protected from "./pages/Protected";
import LoginPage from "./pages/LoginPage"; // Importez la page de connexion
import CreateProductPage from "./pages/CreateProductPage";

function App() {
  return (
    <ErrorBoundary>
      <div className="bg-primary pt-30 h-full">
        <Navbar />
        <div className="container mx-auto p-2 h-full">
          <Routes>
            <Route path="/technical/" element={<HomePage />} />
            <Route path="/technical/login" element={<LoginPage />} /> {/* Nouvelle route */}
            <Route element={<Protected />}>
              <Route index element={<HomePage />} />
              {/* Routes protégées */}
              <Route
                path="/technical/profile"
                element={<ProfilePage />}
              ></Route>
              <Route
                path="/technical/profile/edit"
                element={<EditProfilePage />}
              ></Route>
              <Route
                path="/technical/profile/settings"
                element={<SettingsPage />}
              ></Route>

              {/* Routes d'API et d'intégration */}
              <Route
                path="/technical/api-keys"
                element={<ApiKeysPage />}
              ></Route>
              <Route
                path="/technical/api-documentation"
                element={<ApiDocumentationPage />}
              ></Route>
              <Route
                path="/technical/api-usage"
                element={<ApiUsagePage />}
              ></Route>

              {/* Routes de gestion des composants */}

              <Route
                path="/technical/my-downloads"
                element={<MyDownloadsPage />}
              ></Route>
              <Route
                path="/technical/product/:id"
                element={<ProductDetailPage />}
              ></Route>
              <Route
                path="/technical/create-product"
                element={<CreateProductPage />}
              ></Route>


              {/* Routes de gestion des containers */}
            </Route>
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
