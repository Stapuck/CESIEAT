import { useState } from "react";
import { Link } from "react-router-dom";

const ApiDocumentationPage = () => {
  const [activeTab, setActiveTab] = useState("introduction");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Documentation API</h1>
        <p className="text-gray-600">Guides et références pour intégrer nos composants à vos applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar de navigation */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
            <h2 className="font-bold text-lg mb-4">Sommaire</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab("introduction")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "introduction"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Introduction
              </button>
              <button
                onClick={() => setActiveTab("authentication")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "authentication"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Authentification
              </button>
              <button
                onClick={() => setActiveTab("endpoints")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "endpoints"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Points d'entrée
              </button>
              <button
                onClick={() => setActiveTab("errors")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "errors"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Gestion des erreurs
              </button>
              <button
                onClick={() => setActiveTab("examples")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "examples"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Exemples d'intégration
              </button>
              <button
                onClick={() => setActiveTab("libraries")}
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "libraries"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Bibliothèques clientes
              </button>
            </nav>
            
            <div className="mt-6">
              <Link 
                to="/developer/api-keys" 
                className="block text-blue-600 hover:underline mb-2"
              >
                Gérer mes clés API
              </Link>
              <Link 
                to="/developer/api-usage" 
                className="block text-blue-600 hover:underline"
              >
                Voir mes statistiques d'utilisation
              </Link>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {activeTab === "introduction" && (
              <div className="prose max-w-none">
                <h2>Introduction à l'API CESIEAT</h2>
                <p>
                  L'API CESIEAT permet d'intégrer facilement des composants logiciels dans vos applications. 
                  Notre API RESTful offre des points d'entrée pour accéder à tous nos composants, 
                  gérer vos téléchargements et suivre votre utilisation.
                </p>
                <h3>Version actuelle</h3>
                <p>
                  La version actuelle de l'API est <code>v1</code>. Toutes les requêtes doivent être adressées à:
                </p>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  https://api.localhost/v1/
                </pre>
                <h3>Format des données</h3>
                <p>
                  L'API accepte et renvoie des données au format JSON. Assurez-vous d'inclure l'en-tête 
                  <code>Content-Type: application/json</code> dans vos requêtes.
                </p>
                <h3>Limites de débit</h3>
                <p>
                  Par défaut, l'API limite les requêtes à 100 par minute par clé API. 
                  Si vous dépassez cette limite, vous recevrez une réponse 429 (Too Many Requests).
                </p>
              </div>
            )}

            {activeTab === "authentication" && (
              <div className="prose max-w-none">
                <h2>Authentification</h2>
                <p>
                  L'API CESIEAT utilise des clés API pour authentifier les requêtes. Vous pouvez consulter et gérer vos 
                  clés API dans la section <Link to="/developer/api-keys" className="text-blue-600 hover:underline">Mes clés d'API</Link>.
                </p>
                <h3>Authentification par en-tête</h3>
                <p>
                  Pour authentifier vos requêtes, incluez votre clé API dans l'en-tête HTTP <code>Authorization</code> :
                </p>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`Authorization: Bearer YOUR_API_KEY`}
                </pre>
                <h3>Exemple de requête authentifiée</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`curl -H "Authorization: Bearer api_key_1a2b3c4d5e6f" \
     -H "Content-Type: application/json" \
     https://api.localhost/v1/components`}
                </pre>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        Ne partagez jamais votre clé API. Traitez-la comme un mot de passe.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "endpoints" && (
              <div className="prose max-w-none">
                <h2>Points d'entrée API</h2>
                <p>
                  L'API CESIEAT propose les points d'entrée suivants pour interagir avec nos services.
                </p>

                <h3>Composants</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Méthode</th>
                      <th className="text-left py-2">Point d'entrée</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>GET</code></td>
                      <td className="py-2"><code>/components</code></td>
                      <td className="py-2">Liste tous les composants disponibles</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>GET</code></td>
                      <td className="py-2"><code>/components/{'{id}'}</code></td>
                      <td className="py-2">Récupère les détails d'un composant spécifique</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>POST</code></td>
                      <td className="py-2"><code>/components</code></td>
                      <td className="py-2">Crée un nouveau composant</td>
                    </tr>
                  </tbody>
                </table>

                <h3>Téléchargements</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Méthode</th>
                      <th className="text-left py-2">Point d'entrée</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>GET</code></td>
                      <td className="py-2"><code>/downloads</code></td>
                      <td className="py-2">Liste vos téléchargements</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>POST</code></td>
                      <td className="py-2"><code>/downloads</code></td>
                      <td className="py-2">Initie un nouveau téléchargement</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "errors" && (
              <div className="prose max-w-none">
                <h2>Gestion des erreurs</h2>
                <p>
                  L'API CESIEAT utilise des codes de statut HTTP conventionnels pour indiquer le succès ou l'échec d'une requête API.
                </p>

                <h3>Codes d'erreur courants</h3>
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Code</th>
                      <th className="text-left py-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>200 OK</code></td>
                      <td className="py-2">La requête a réussi</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>400 Bad Request</code></td>
                      <td className="py-2">La requête était invalide ou ne peut pas être traitée</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>401 Unauthorized</code></td>
                      <td className="py-2">Authentification incorrecte</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>403 Forbidden</code></td>
                      <td className="py-2">L'accès à la ressource est interdit</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>404 Not Found</code></td>
                      <td className="py-2">La ressource demandée n'existe pas</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>429 Too Many Requests</code></td>
                      <td className="py-2">Limite de débit dépassée</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>500 Internal Server Error</code></td>
                      <td className="py-2">Erreur interne du serveur</td>
                    </tr>
                  </tbody>
                </table>

                <h3>Format des réponses d'erreur</h3>
                <p>En cas d'erreur, l'API renvoie un objet JSON avec la structure suivante :</p>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`{
  "error": {
    "code": "error_code",
    "message": "Description détaillée de l'erreur",
    "status": 400
  }
}`}
                </pre>
              </div>
            )}

            {activeTab === "examples" && (
              <div className="prose max-w-none">
                <h2>Exemples d'intégration</h2>
                <p>
                  Voici quelques exemples d'utilisation de l'API CESIEAT dans différents langages de programmation.
                </p>

                <h3>JavaScript (fetch)</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`// Récupérer la liste des composants
fetch('https://api.localhost/v1/components', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));`}
                </pre>

                <h3>Python (requests)</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

# Récupérer la liste des composants
response = requests.get('https://api.localhost/v1/components', headers=headers)
print(response.json())`}
                </pre>

                <h3>PHP (curl)</h3>
                <pre className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  {`<?php
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.localhost/v1/components");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
));

$response = curl_exec($ch);
$data = json_decode($response, true);
print_r($data);
curl_close($ch);
?>`}
                </pre>
              </div>
            )}

            {activeTab === "libraries" && (
              <div className="prose max-w-none">
                <h2>Bibliothèques clientes</h2>
                <p>
                  Pour faciliter l'intégration de l'API CESIEAT dans votre application, nous proposons des bibliothèques clientes dans plusieurs langages de programmation.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">JavaScript / TypeScript</h3>
                    <p className="mb-4">Bibliothèque officielle pour Node.js et navigateurs.</p>
                    <pre className="bg-gray-800 text-white p-2 rounded-md mb-3">npm install cesieat-api</pre>
                    <a href="#" className="text-blue-600 hover:underline">Documentation →</a>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Python</h3>
                    <p className="mb-4">Client Python pour intégrer l'API CESIEAT facilement.</p>
                    <pre className="bg-gray-800 text-white p-2 rounded-md mb-3">pip install cesieat-python</pre>
                    <a href="#" className="text-blue-600 hover:underline">Documentation →</a>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">PHP</h3>
                    <p className="mb-4">Package PHP pour intégrer l'API CESIEAT.</p>
                    <pre className="bg-gray-800 text-white p-2 rounded-md mb-3">composer require cesieat/api-client</pre>
                    <a href="#" className="text-blue-600 hover:underline">Documentation →</a>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-2">Java</h3>
                    <p className="mb-4">Client Java pour applications Android et serveurs.</p>
                    <pre className="bg-gray-800 text-white p-2 rounded-md mb-3">implementation 'com.cesieat:api-client:1.0.0'</pre>
                    <a href="#" className="text-blue-600 hover:underline">Documentation →</a>
                  </div>
                </div>

                <p>
                  Toutes nos bibliothèques clientes sont open-source et disponibles sur notre <a href="#" className="text-blue-600 hover:underline">GitHub</a>.
                  Nous accueillons les contributions et les suggestions d'amélioration.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiDocumentationPage;
