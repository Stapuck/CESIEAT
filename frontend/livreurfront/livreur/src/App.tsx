
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import CreatePage from "./pages/CreatePage"
import EditPage from "./pages/EditPage"
import NotFoundPage from "./components/NotFoundPage"

import { ToastContainer } from 'react-toastify';
import Account from "./pages/Account"
import Livraison from "./pages/Livraison"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"


function App() {
  return (
    <div className="bg-primary">
      <Navbar/>
      <div className="container mx-auto mt-30 h-full">
      <Routes>
        <Route index element={<HomePage/>}></Route>
        <Route path='/livreur/' element={<HomePage/>}></Route>
        
        <Route path='/create-product' element={<CreatePage/>}></Route>
        <Route path='/edit-product/:id' element={<EditPage/>}></Route>
        <Route path='/account' element={<Account/>}></Route>
        <Route path='/livraison/:id' element={<Livraison/>}></Route>



        <Route path="/404" element={<NotFoundPage/>} />
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      </div>
      <ToastContainer/>
      <Footer/>


    </div>
  )
}

export default App