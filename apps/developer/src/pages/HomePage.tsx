import { Link } from "react-router-dom";
import GalleryProduct from "../components/GalleryProduct";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Portail Développeur</h1>
        <p className="text-gray-600">Intégrez des composants logiciels à vos applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Section Compte */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Gestion du Compte</h2>
          <div className="flex flex-col gap-2">
            <Link to="/developer/profile" className="text-blue-600 hover:underline">Consulter mon profil</Link>
            <Link to="/developer/profile/edit" className="text-blue-600 hover:underline">Modifier mon compte</Link>
            <Link to="/developer/profile/settings" className="text-blue-600 hover:underline">Paramètres du compte</Link>
          </div>
        </div>

        {/* Section API */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">API & Intégration</h2>
          <div className="flex flex-col gap-2">
            <Link to="/developer/api-keys" className="text-blue-600 hover:underline">Mes clés d'API</Link>
            <Link to="/developer/api-documentation" className="text-blue-600 hover:underline">Documentation API</Link>
            <Link to="/developer/api-usage" className="text-blue-600 hover:underline">Statistiques d'utilisation</Link>
          </div>
        </div>
      </div>

      {/* Section Composants */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Composants Disponibles</h2>
          <div className="flex gap-2">
            <Link to="/developer/create-product" className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors">
              Créer un composant
            </Link>
            <Link to="/developer/my-downloads" className="bg-green-600 text-white rounded-md px-4 py-2 font-medium hover:bg-green-500 transition-colors">
              Mes téléchargements
            </Link>
          </div>
        </div>

        {/* Galerie de composants existante */}
        <div>
          <GalleryProduct/>
        </div>
      </div>
    </div>
  );
};

export default HomePage;