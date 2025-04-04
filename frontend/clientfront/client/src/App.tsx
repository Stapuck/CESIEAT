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

function App() {
  return (
    <CartProvider>
      <ErrorBoundary fallback={<Navigate to="/client/" />}>
        <div className="bg-primary pt-30 h-full">
          <Navbar />
          <Routes>
            <Route path="/client/" element={<HomePageWithoutLogin />} />
            <Route
              path="/client/restaurant/:slug"
              element={<ShowRestaurantMenu login={false} />}
            />

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
