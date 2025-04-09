import { Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CartProvider } from "./context/CartContext";
import ErrorBoundary from "./components/Error/ErrorBoundary"; // Importer le composant ErrorBoundary

// Importer les pages
import HomePage from "./pages/HomePage";

import NotFoundPage from "./components/NotFoundPage";

import ShowRestaurantMenu from "./pages/restaurantsPages/ShowRestaurantMenu";
import Cart from "./pages/cart/cart";
import Checkout from "./pages/checkout/checkout";
import AccountPage from "./pages/AccountPage";
import Protected from "./pages/Protected";
import HomePageWithoutLogin from "./pages/HomePageWithoutLogin";
import AboutUs from "./pages/AboutUs";
import ConfidentialityPage from "./pages/ConfidentialityPage";
import FAQPage from "./pages/FAQ";
import TarifsPage from "./pages/Tarif"; 
import Promotion from "./pages/Promotion"; 
import Terms from "./pages/TermPage"; 
import Contact from "./pages/ContactPage"; 
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <CartProvider>
      <ErrorBoundary fallback={<Navigate to="/client/" />}>
        <div className="bg-primary pt-30 h-full">
          <Navbar />
          <ScrollToTop />
          <Routes>
            <Route path="/client/" element={<HomePageWithoutLogin />} />
            <Route
              path="/client/restaurant/:slug"
              element={<ShowRestaurantMenu login={false} />}
            />

            <Route path="/client/aboutus" element={<AboutUs/>}/>
            <Route path="/client/confidentialité" element={<ConfidentialityPage/>}/>
            <Route path="/client/faq" element={<FAQPage/>}/>
            <Route path="/client/tarif" element={<TarifsPage/>}/>
            <Route path="/client/promotion" element={<Promotion/>}/>
            <Route path="/client/terms" element={<Terms/>}/>
            <Route path="/client/contact" element={<Contact/>}/>

            <Route element={<Protected />}>
              {/* Routes principales */}
              <Route path="/client/" element={<HomePage />} />

              <Route
                path="/client/restaurant/:slug"
                element={<ShowRestaurantMenu login={true} />}
              />
              <Route path="/client/404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />

              <Route path="/client/account" element={<AccountPage />} />

              {/* Routes liées au panier */}
              <Route path="/client/cart" element={<Cart />} />
              <Route path="/client/checkout" element={<Checkout />} />
            </Route>
          </Routes>
          <Footer />

          {/* Configuration du ToastContainer */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </ErrorBoundary>
    </CartProvider>
  );
}

export default App;
