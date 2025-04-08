import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";

import EditProfilePage from "./pages/EditProfilePage";

import ProfilePage from "./pages/ProfilePage";
import Protected from "./pages/Protected";
import LoginPage from "./pages/LoginPage";
import CreateProductPage from "./pages/CreateProductPage";
import LogsPage from "./pages/LogsPage";

function App() {
  return (
    <ErrorBoundary>
      <div className="bg-primary pt-30 h-full">
        <Navbar />
        <div className="container mx-auto p-2 h-full">
          <Routes>
            <Route path="/technical/login" element={<LoginPage />} />
            
            <Route element={<Protected />}>
              <Route path="/technical/" element={<HomePage />} />
              <Route
                path="/technical/profile"
                element={<ProfilePage />}
              ></Route>
              <Route
                path="/technical/profile/edit"
                element={<EditProfilePage />}
              ></Route>
              <Route
                path="/technical/create-product"
                element={<CreateProductPage />}
              ></Route>
              <Route path="/technical/logs" element={<LogsPage />} />
            </Route>
          </Routes>
        </div>
        <Footer />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
