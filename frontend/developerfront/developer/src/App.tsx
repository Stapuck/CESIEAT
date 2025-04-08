import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ErrorBoundary from "./components/ErrorBoundary";

import ProfilePage from "./pages/ProfilePage";
import Protected from "./pages/Protected";
import LoginPage from "./pages/LoginPage";
import EditProfilePage from "./pages/EditProfilePage";

function App() {
  return (
    <ErrorBoundary>
      <div className="bg-primary pt-30 h-full">
        <Navbar />
        <div className="container mx-auto p-2 h-full">
          <Routes>
            <Route path="/developer/login" element={<LoginPage />} />

            <Route element={<Protected />}>
              <Route path="/developer/" element={<HomePage />} />
              <Route
                path="/developer/profile"
                element={<ProfilePage />}
              ></Route>
              <Route
                path="/developer/profile/edit"
                element={<EditProfilePage />}
              ></Route>
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
