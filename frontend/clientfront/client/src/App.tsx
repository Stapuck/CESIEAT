import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import TestPage from "./pages/TestPage"
import CreatePage from "./pages/CreatePage"
import EditPage from "./pages/EditPage"
import NotFoundPage from "./components/NotFoundPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importer les styles CSS
import CreateRestaurant from "./pages/restaurantsPages/CreateRestaurant"
import EditRestaurant from "./pages/restaurantsPages/EditRestaurant"
import CreateMenu from "./pages/menuPages/CreateMenu"
import EditMenu from "./pages/menuPages/EditMenu"
import LoginPage from "./pages/LoginPage"
import SigninPage from "./pages/SigninPage"
import ShowRestaurantMenu from "./pages/restaurantsPages/ShowRestaurantMenu"

function App() {
  return (
    <div className="bg-primary pt-30 h-full">
      <Navbar />
      <Routes>
        <Route path='/client/' element={<HomePage />}></Route>

        <Route path='/create-product' element={<CreatePage />}></Route>
        <Route path='/create-restaurant' element={<CreateRestaurant />}></Route>
        <Route path='/create-menu' element={<CreateMenu />}></Route>
        <Route path='/edit-product/:id' element={<EditPage />}></Route>
        <Route path='/edit-restaurant/:id' element={<EditRestaurant />}></Route>
        <Route path='/edit-menu/:id' element={<EditMenu />}></Route>
        <Route path="/restaurant-menus" element={<ShowRestaurantMenu />} />

        <Route path='/test' element={<TestPage />}></Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path='/login' element={<LoginPage />}></Route>
        <Route path='/signin' element={<SigninPage />}></Route>
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
  )
}

export default App