import { Link } from "react-router-dom";

const CommandesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
        <Link to='/historique' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Historique des commandes
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Nouvelle Commande */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouvelles Commandes</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
          </div>
        </div>

        {/* Commande en préparation */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Préparation</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            <p className="text-gray-600">Aucune commande en préparation pour l'instant.</p>
          </div>
        </div>

        {/* Commande en attente de récupération */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Attente de Récupération</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            <p className="text-gray-600">Aucune commande en attente pour le moment.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandesPage;


// question : faire 3 appel dans commande en fonction du status des commandes ??
// sinon revoir npm i @asseinfo/react-kanban \\ @asseinfo/react-kanban