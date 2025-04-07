import { useState } from "react";
import { Link } from "react-router-dom";

const ApiKeysPage = () => {
  // Données simulées des clés API
  const [apiKeys, setApiKeys] = useState([
    { id: 1, name: "Production App", key: "api_prod_7f9a8b3c2d1e", created: "15/04/2023", lastUsed: "Aujourd'hui", status: "active" },
    { id: 2, name: "Test Environment", key: "api_test_5e6f7g8h9i0j", created: "20/06/2023", lastUsed: "Hier", status: "active" },
    { id: 3, name: "Development", key: "api_dev_1a2b3c4d5e6f", created: "10/01/2023", lastUsed: "10/03/2023", status: "inactive" },
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");

  const createNewKey = () => {
    if (newKeyName.trim()) {
      const newKey = {
        id: apiKeys.length + 1,
        name: newKeyName,
        key: `api_key_${Math.random().toString(36).substring(2, 15)}`,
        created: new Date().toLocaleDateString('fr-FR'),
        lastUsed: "Jamais",
        status: "active"
      };
      setApiKeys([...apiKeys, newKey]);
      setNewKeyName("");
      setShowCreateForm(false);
    }
  };

  const toggleKeyStatus = (id: number) => {
    setApiKeys(apiKeys.map(key => {
      if (key.id === id) {
        return {
          ...key,
          status: key.status === "active" ? "inactive" : "active"
        };
      }
      return key;
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Clés d'API</h1>
        <p className="text-gray-600">Gérez vos clés d'API pour accéder aux services de la plateforme</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Clés API existantes</h2>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors"
          >
            Créer une nouvelle clé
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">Créer une nouvelle clé API</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Nom de la clé"
                className="flex-grow border rounded-md px-3 py-2"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
              <button 
                onClick={createNewKey}
                className="bg-green-600 text-white rounded-md px-4 py-2 font-medium hover:bg-green-500 transition-colors"
              >
                Créer
              </button>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="bg-gray-300 text-gray-700 rounded-md px-4 py-2 font-medium hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-sm">
                <th className="py-3 px-4 text-left">Nom</th>
                <th className="py-3 px-4 text-left">Clé API</th>
                <th className="py-3 px-4 text-left">Date de création</th>
                <th className="py-3 px-4 text-left">Dernière utilisation</th>
                <th className="py-3 px-4 text-left">Statut</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {apiKeys.map((key) => (
                <tr key={key.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{key.name}</td>
                  <td className="py-3 px-4">
                    <span className="font-mono bg-gray-100 p-1 rounded text-sm">{key.key}</span>
                  </td>
                  <td className="py-3 px-4">{key.created}</td>
                  <td className="py-3 px-4">{key.lastUsed}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => toggleKeyStatus(key.id)}
                        className={`text-xs px-2 py-1 rounded ${
                          key.status === 'active' 
                            ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {key.status === 'active' ? 'Désactiver' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Comment utiliser votre clé API</h2>
        <div className="prose max-w-none">
          <p>Utilisez votre clé API pour vous authentifier lors des appels à notre API. Voici un exemple:</p>
          <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
            {`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.localhost/v1/components`}
          </pre>
          <p className="mt-4">Pour plus d'informations, consultez notre <Link to="/developer/api-documentation" className="text-blue-600 hover:underline">documentation API</Link>.</p>
        </div>
      </div>
    </div>
  );
};

export default ApiKeysPage;
