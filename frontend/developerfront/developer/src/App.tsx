import { Link, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="bg-primary pt-30 h-full">
      <Navbar />
      <div className="container mx-auto p-2 h-full">
        <Routes>
          <Route index element={<HomePage />}></Route>
          <Route path="/developer/" element={<HomePage />}></Route>
        </Routes>
        
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
