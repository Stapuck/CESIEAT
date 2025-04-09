import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";

import EditProfilePage from "./pages/EditProfilePage";

import ProfilePage from "./pages/ProfilePage";
import Protected from "./pages/Protected";
import LoginPage from "./pages/LoginPage"; // Importez la page de connexion
import CreateProductPage from "./pages/CreateProductPage";
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
    <ErrorBoundary>
      <div className="bg-primary pt-30 h-full">
        <Navbar />
        <div className="container mx-auto p-2 h-full">
          <ScrollToTop />
          <Routes>
            <Route path="/technical/" element={<HomePage />} />
            <Route path="/technical/login" element={<LoginPage />} />{" "}
            <Route path="technical/aboutus" element={<AboutUs />} />
            <Route path="technical/faq" element={<FAQPage />} />
            <Route path="technical/contact" element={<Contact />} />
            <Route
              path="technical/confidentialité"
              element={<ConfidentialityPage />}
            />
            <Route path="technical/terms" element={<Terms />} />
            <Route path="technical/tarif" element={<TarifsPage />} />
            <Route path="technical/promotion" element={<Promotion />} />
            {/* Nouvelle route */}
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
