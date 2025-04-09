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
          <Routes>
            <Route path="/commercial/login" element={<LoginButton />} />
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
