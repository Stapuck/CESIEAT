import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ApiKeysPage from "./pages/ApiKeysPage";
import EditProfilePage from "./pages/EditProfilePage";
import MyDownloadsPage from "./pages/MyDownloadsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ApiDocumentationPage from "./pages/ApiDocumentationPage";
import ApiUsagePage from "./pages/ApiUsagePage";
import CreateProductPage from "./pages/CreateProductPage";
import ProductDetailPage from "./pages/ProductDetailPage";


function App() {
  return (
    <div className="bg-primary pt-30 h-full">
      <Navbar />
      <div className="container mx-auto p-2 h-full">
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/developer/" element={<HomePage />}></Route>
          
          {/* Routes de gestion du compte */}
          <Route path="/developer/profile" element={<ProfilePage />}></Route>
          <Route path="/developer/profile/edit" element={<EditProfilePage />}></Route>
          <Route path="/developer/profile/settings" element={<SettingsPage />}></Route>
          
          {/* Routes d'API et d'intégration */}
          <Route path="/developer/api-keys" element={<ApiKeysPage />}></Route>
          <Route path="/developer/api-documentation" element={<ApiDocumentationPage />}></Route>
          <Route path="/developer/api-usage" element={<ApiUsagePage />}></Route>
          
          {/* Routes de gestion des composants */}
          <Route path="/developer/create-product" element={<CreateProductPage />}></Route>
          <Route path="/developer/my-downloads" element={<MyDownloadsPage />}></Route>
          <Route path="/developer/product/:id" element={<ProductDetailPage />}></Route>
        </Routes>
        
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
