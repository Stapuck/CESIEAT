import { Link } from "react-router-dom";

const MyDownloadsPage = () => {
  // Données simulées des téléchargements
  const downloads = [
    {
      id: 1,
      name: "Système d'authentification",
      version: "2.3.0",
      downloadDate: "15/07/2023",
      type: "Authentication",
      language: "JavaScript",
      license: "MIT"
    },
    {
      id: 2,
      name: "Module de paiement sécurisé",
      version: "1.5.2",
      downloadDate: "22/08/2023",
      type: "Payment",
      language: "TypeScript",
      license: "Commercial"
    },
    {
      id: 3,
      name: "Gestionnaire de notifications",
      version: "3.1.0",
      downloadDate: "10/09/2023",
      type: "Notifications",
      language: "Java",
      license: "Apache 2.0"
    },
    {
      id: 4,
      name: "Système d'analyse de données",
      version: "2.0.1",
      downloadDate: "05/10/2023",
      type: "Analytics",
      language: "Python",
      license: "BSD"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Téléchargements</h1>
        <p className="text-gray-600">Historique des composants que vous avez téléchargés</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Composants téléchargés</h2>
            <Link to="/developer" className="text-blue-600 hover:underline">
              Explorer plus de composants
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {downloads.map((download) => (
              <div key={download.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{download.name}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    {download.version}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Téléchargé le {download.downloadDate}</p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div>
                    <p className="text-xs text-gray-500">Type</p>
                    <p className="text-sm">{download.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Langage</p>
                    <p className="text-sm">{download.language}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Licence</p>
                    <p className="text-sm">{download.license}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link 
                    to={`/developer/product/${download.id}`} 
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Voir les détails
                  </Link>
                  <button className="text-green-600 text-sm hover:underline">
                    Télécharger à nouveau
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDownloadsPage;
