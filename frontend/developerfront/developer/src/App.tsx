import { Route, Routes } from "react-router-dom";
            <Route path="developer/aboutus" element={<AboutUs />} />
            <Route path="developer/faq" element={<FAQPage />} />
            <Route path="developer/contact" element={<Contact />} />
            <Route
              path="developer/confidentialité"
              element={<ConfidentialityPage />}
            />
            <Route path="developer/terms" element={<Terms />} />
            <Route path="developer/tarif" element={<TarifsPage />} />
            <Route path="developer/promotion" element={<Promotion />} />
        <ScrollToTop/>

            <Route path="developer/aboutus" element={<AboutUs />} />
            <Route path="developer/faq" element={<FAQPage />} />
            <Route path="developer/contact" element={<Contact />} />
            <Route
              path="developer/confidentialité"
              element={<ConfidentialityPage />}
            />
            <Route path="developer/terms" element={<Terms />} />
            <Route path="developer/tarif" element={<TarifsPage />} />
            <Route path="developer/promotion" element={<Promotion />} />
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
import Protected from "./pages/Protected";
import LoginButton from "./components/LoginButton";
import ScrollToTop from "./components/ScrollToTop";
import AboutUs from "./pages/AboutUs";
import ConfidentialityPage from "./pages/ConfidentialityPage";
import FAQPage from "./pages/FAQ";
import TarifsPage from "./pages/Tarif";
import Promotion from "./pages/Promotion";
import Terms from "./pages/TermPage";
import Contact from "./pages/ContactPage";

function App() {
  return (
    <div className="bg-primary pt-30 h-full">
      <Navbar />
      <div className="container mx-auto p-2 h-full">
        <ScrollToTop/>
        <Routes>
          <Route path="/developer/tmplogin" element={<LoginButton />} />
          <Route element={<Protected />}>
            <Route index element={<HomePage />}></Route>
            <Route path="/developer/" element={<HomePage />}></Route>
            <Route path="developer/aboutus" element={<AboutUs />} />
            <Route path="developer/faq" element={<FAQPage />} />
            <Route path="developer/contact" element={<Contact />} />
            <Route
              path="developer/confidentialité"
              element={<ConfidentialityPage />}
            />
            <Route path="developer/terms" element={<Terms />} />
            <Route path="developer/tarif" element={<TarifsPage />} />
            <Route path="developer/promotion" element={<Promotion />} />

            {/* Routes de gestion du compte */}
            <Route path="/developer/profile" element={<ProfilePage />}></Route>
            <Route
              path="/developer/profile/edit"
              element={<EditProfilePage />}
            ></Route>
            <Route
              path="/developer/profile/settings"
              element={<SettingsPage />}
            ></Route>

            {/* Routes d'API et d'intégration */}
            <Route path="/developer/api-keys" element={<ApiKeysPage />}></Route>
            <Route
              path="/developer/api-documentation"
              element={<ApiDocumentationPage />}
            ></Route>
            <Route
              path="/developer/api-usage"
              element={<ApiUsagePage />}
            ></Route>

            {/* Routes de gestion des composants */}
            <Route
              path="/developer/create-product"
              element={<CreateProductPage />}
            ></Route>
            <Route
              path="/developer/my-downloads"
              element={<MyDownloadsPage />}
            ></Route>
            <Route
              path="/developer/product/:id"
              element={<ProductDetailPage />}
            ></Route>
          </Route>
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
