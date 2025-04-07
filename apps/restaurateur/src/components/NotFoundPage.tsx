import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-600 mt-2">Oops! Page non trouvée.</p>
      <Link to="/restaurateur/" className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700">
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;
