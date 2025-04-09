// src/App.tsx
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import { ToastContainer } from "react-toastify"
import ClientAccountsPage from "./pages/ClientAccountsPage"
import OrderManagementPage from "./pages/OrderManagementPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Protected from "./pages/Protected"
import LoginButton from "./components/LoginButton"
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
    <div className="bg-primary pt-20 h-full">
      <Navbar />
      <div className="flex bg-primary">
        {/* Left Side Navigation */}
        <div className="w-1/6 bg-gray-800 text-white p-4">
          <h2 className="text-2xl font-bold mb-6">Portail Commercial</h2>
          <ul>
            <li>
              <Link to="/commercial" className="block py-2 hover:bg-gray-700 rounded">Accueil</Link>
            </li>
            <li>
              <Link to="/commercial/clientAccountsPage" className="block py-2 hover:bg-gray-700 rounded">Comptes Clients</Link>
            </li>
            <li>
              <Link to="/commercial/orderManagementPage" className="block py-2 hover:bg-gray-700 rounded">Commandes Clients</Link>
            </li>
          </ul>
        </div>

        {/* Right Side Content */}
        <div className="w-3/4 p-6">
          <ScrollToTop />
          <Routes>
            <Route path="/commercial/login" element={<LoginButton />} />
            <Route path="/commercial/aboutus" element={<AboutUs/>}/>
            <Route path="/commercial/confidentialité" element={<ConfidentialityPage/>}/>
            <Route path="/commercial/faq" element={<FAQPage/>}/>
            <Route path="/commercial/tarif" element={<TarifsPage/>}/>
            <Route path="/commercial/promotion" element={<Promotion/>}/>
            <Route path="/commercial/terms" element={<Terms/>}/>
            <Route path="/commercial/contact" element={<Contact/>}/>
            <Route element={<Protected />}>
              <Route index element={<HomePage />} />
              <Route path="/commercial" element={<HomePage />} />
              <Route path="/commercial/clientAccountsPage" element={<ClientAccountsPage />} />
              <Route path="/commercial/orderManagementPage" element={<OrderManagementPage />} />
            </Route>
          </Routes>
        </div>

        <ToastContainer />
      </div>
      
      <Footer />
      <ToastContainer />
    </div>
  )
}

export default App
