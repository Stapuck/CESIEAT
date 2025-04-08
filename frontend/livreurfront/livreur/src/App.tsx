import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";

import NotFoundPage from "./components/NotFoundPage";

import { ToastContainer } from "react-toastify";
import Account from "./pages/Account";
import Livraison from "./pages/Livraison";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScanPage from "./pages/ScanPage";
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
    <div className="bg-primary pt-20">
      <Navbar />
      <div className="container mx-auto mt-22 h-full">
        <ScrollToTop/>
        <Routes>
          <Route path="/livreur/login" element={<LoginButton/>} />

          <Route path="/livreur/faq" element={<FAQPage/>} />
          <Route path="/livreur/aboutus" element={<AboutUs/>} />
          <Route path="/livreur/confidentialité" element={<ConfidentialityPage/>} />
          <Route path="/livreur/tarif" element={<TarifsPage/>} />
          <Route path="/livreur/promotion" element={<Promotion/>} />
          <Route path="/livreur/terms" element={<Terms/>} />
          <Route path="/livreur/contact" element={<Contact/>} />
          
          <Route element={<Protected />}>
            <Route index element={<HomePage />}></Route>
            <Route path="/livreur/" element={<HomePage />}></Route>
            <Route path="/livreur/account" element={<Account />}></Route>

            <Route path="/account" element={<Account />}></Route>
            <Route path="/livraison/:id" element={<Livraison />}></Route>
            <Route path="/livreur/scan" element={<ScanPage />} />

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </div>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;
