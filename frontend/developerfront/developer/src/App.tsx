import { Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import ProfilePage from "./pages/ProfilePage";

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



          </Route>
        </Routes>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
