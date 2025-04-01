import { Link } from "react-router-dom";
import GalleryProduct from "../components/GalleryProduct";

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Portail Technique</h1>
        <p className="text-gray-600">Intégrez des composants logiciels à vos applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Section Compte */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Gestion du Compte</h2>
          <div className="flex flex-col gap-2">
            <Link to="/profile" className="text-blue-600 hover:underline">Consulter mon profil</Link>
            <Link to="/profile/edit" className="text-blue-600 hover:underline">Modifier mon compte</Link>
            <Link to="/profile/settings" className="text-blue-600 hover:underline">Paramètres du compte</Link>
          </div>
        </div>

        {/* Section API */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">API & Intégration</h2>
          <div className="flex flex-col gap-2">
            <Link to="/api-keys" className="text-blue-600 hover:underline">Mes clés d'API</Link>
            <Link to="/api-documentation" className="text-blue-600 hover:underline">Documentation API</Link>
            <Link to="/api-usage" className="text-blue-600 hover:underline">Statistiques d'utilisation</Link>
          </div>
        </div>
      </div>

      {/* Section Composants */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Composants Disponibles</h2>
          <div className="flex gap-2">
            <Link to="/create-product" className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors">
              Créer un composant
            </Link>
            <Link to="/my-downloads" className="bg-green-600 text-white rounded-md px-4 py-2 font-medium hover:bg-green-500 transition-colors">
              Mes téléchargements
            </Link>
          </div>
        </div>

        {/* Galerie de composants existante */}
        <div>
          <GalleryProduct/>
        </div>
      </div>

      {/* Section Service Technique */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-yellow-800">Service Technique</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Gestion des composants */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-yellow-700">Gestion des composants</h3>
            <div className="flex flex-col gap-2">
              <Link to="/technical/components/manage" className="text-blue-600 hover:underline">Gérer les composants</Link>
              <Link to="/technical/components/add" className="text-blue-600 hover:underline">Ajouter un composant</Link>
              <Link to="/technical/components/remove" className="text-blue-600 hover:underline">Supprimer des composants</Link>
            </div>
          </div>
          
          {/* Logs et statistiques */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-yellow-700">Monitoring Docker</h3>
            <div className="flex flex-col gap-2">
              <Link to="/technical/logs/connections" className="text-blue-600 hover:underline">Logs de connexions</Link>
              <Link to="/technical/logs/downloads" className="text-blue-600 hover:underline">Logs de téléchargement</Link>
              <Link to="/technical/stats/performance" className="text-blue-600 hover:underline">Statistiques de performance</Link>
              <Link to="/technical/docker/containers" className="text-blue-600 hover:underline">État des containers</Link>
              <Link to="/technical/docker/resources" className="text-blue-600 hover:underline">Utilisation des ressources</Link>
              <Link to="/technical/docker/logs" className="text-blue-600 hover:underline">Logs des containers</Link>
            </div>
          </div>
          
          {/* Infrastructure */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-yellow-700">Infrastructure</h3>
            <div className="flex flex-col gap-2">
              <Link to="/technical/routes" className="text-blue-600 hover:underline">Orchestration des routes</Link>
              <Link to="/technical/deploy" className="text-blue-600 hover:underline">Déploiement de services</Link>
              <Link to="/technical/notifications" className="text-blue-600 hover:underline">Centre de notifications <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span></Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;