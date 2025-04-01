import { Link, Route, Routes, BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import DockerContainersPage from "./pages/DockerContainersPage";
import ErrorBoundary from "./components/ErrorBoundary";
import DockerLogsPage from "./pages/DockerLogsPage";

function App() {
  return (
      <ErrorBoundary>
        <div className="bg-primary pt-30 h-full">
          <Navbar />
          <div className="container mx-auto p-2 h-full">
            <Routes>
              <Route index element={<HomePage />}></Route>
              <Route path="/technical/" element={<HomePage />}></Route>
              <Route
                path="/technical/docker/containers"
                element={<DockerContainersPage />}
              />
              <Route path="/technical/docker/logs" element={<DockerLogsPage />} />

            </Routes>
          </div>
          <Footer />
          <ToastContainer />
        </div>
      </ErrorBoundary>
  );
}

export default App;
