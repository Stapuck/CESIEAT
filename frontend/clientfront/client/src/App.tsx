
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import TestPage from "./pages/TestPage"
import CreatePage from "./pages/CreatePage"
import EditPage from "./pages/EditPage"
import NotFoundPage from "./components/NotFoundPage"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"


function App() {
  return (
    <div className="bg-primary">
      <Navbar />
      <Routes>
        <Route index element={<HomePage />}></Route>

        <Route path='/create-product' element={<CreatePage />}></Route>
        <Route path='/edit-product/:id' element={<EditPage />}></Route>


        <Route path='/test' element={<TestPage />}></Route>
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />

        <Route path='/login' element={<EditPage />}></Route>
        <Route path='/signin' element={<EditPage />}></Route>
      </Routes>
      <Footer />
    </div>
  )
}

export default App