import { Link } from "react-router-dom";
import FoodPicture from "../assets/order_food.png"; // Remplacez par le chemin de votre image

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <img src={FoodPicture} alt="Not Found Picture" className="h-100" />
      <h1 className="text-6xl font-bold text-red-600">404</h1>
      <p className="text-xl text-gray-600 ">Oops! Page non trouvée.</p>
      <Link
        to="/client"
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}

export default NotFoundPage;
