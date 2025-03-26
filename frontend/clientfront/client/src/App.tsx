
import { Link, Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage"
import TestPage from "./pages/TestPage"
import CreatePage from "./pages/CreatePage"
import EditPage from "./pages/EditPage"
import NotFoundPage from "./components/NotFoundPage"
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <div className="bg-white">
      <nav className="bg-gray-800">
        <div className="container mx-auto p-2">
          <Link to='/'><h2 className="text-white text-2xl font-bold">Client front</h2></Link>
        </div>
      </nav>

      <div className='container mx-auto p-2 h-full'>
      <Routes>
        <Route index element={<HomePage/>}></Route>
        
        <Route path='/create-product' element={<CreatePage/>}></Route>
        <Route path='/edit-product/:id' element={<EditPage/>}></Route>


        <Route path='/test' element={<TestPage/>}></Route>
        <Route path="/404" element={<NotFoundPage/>} />
          <Route path="*" element={<NotFoundPage />} />

        <Route path='/login' element={<EditPage/>}></Route>
        <Route path='/signin' element={<EditPage/>}></Route>
      </Routes>
      </div>
      <ToastContainer />
    </div>
    
  )
}

export default App