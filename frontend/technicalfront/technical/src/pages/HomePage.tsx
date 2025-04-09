import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLogger } from "../hooks/useLogger";
import { useAuth } from "react-oidc-context";

// Interface pour les composants
interface Component {
  _id: string;
  name: string;
  description: string;
  version: string;
  category: string;
  author: string;
  tags: string[];
  downloadUrl: string;
  documentation: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

const HomePage = () => {
  // État pour stocker les composants
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const logger = useLogger();
  const auth = useAuth();
  const userId = auth.user?.profile?.sub || "unknown";

  // Récupérer les composants au chargement de la page
  useEffect(() => {
    const fetchComponents = async () => {
      try {
        setLoading(true);
        // Utiliser l'URL correcte du backend
        const response = await axios.get("https://cesieat.nathan-lorit.com/api/components");
        setComponents(response.data);
        setError(null);
      } catch (err: any) {
        logger({
          type: "error",
          message: "Erreur lors de la récupération des composants: " + err.message,
          clientId_Zitadel: userId,
        });
        setError(
          "Impossible de charger les composants. Veuillez réessayer plus tard."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComponents();
  }, []);

  // Fonction pour afficher un badge selon la catégorie
  const getCategoryBadge = (category: string) => {
    const categories: Record<string, { bg: string; text: string }> = {
      frontend: { bg: "bg-blue-100", text: "text-blue-800" },
      backend: { bg: "bg-green-100", text: "text-green-800" },
      database: { bg: "bg-purple-100", text: "text-purple-800" },
      security: { bg: "bg-red-100", text: "text-red-800" },
      testing: { bg: "bg-yellow-100", text: "text-yellow-800" },
      utility: { bg: "bg-gray-100", text: "text-gray-800" },
      other: { bg: "bg-indigo-100", text: "text-indigo-800" },
    };

    const style = categories[category] || categories.other;
    return (
      <span
        className={`${style.bg} ${style.text} text-xs px-2 py-0.5 rounded-full`}
      >
        {category}
      </span>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Portail Technique</h1>
        <p className="text-gray-600">
          Intégrez des composants logiciels à vos applications
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Section Compte */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Gestion du Compte</h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/technical/profile"
              className="text-blue-600 hover:underline"
            >
              Consulter mon profil
            </Link>
          </div>
        </div>

        {/* Section API */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">API & Intégration</h2>
          <div className="flex flex-col gap-2">
            <Link
              to="/technical/api-keys"
              className="text-blue-600 hover:underline"
            >
              Mes clés d'API
            </Link>
            <Link
              to="/technical/api-documentation"
              className="text-blue-600 hover:underline"
            >
              Documentation API
            </Link>
            <Link
              to="/technical/api-usage"
              className="text-blue-600 hover:underline"
            >
              Statistiques d'utilisation
            </Link>
          </div>
        </div>
      </div>

      {/* Section Composants */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Composants Disponibles</h2>

          <div className="flex gap-2">
            <Link
              to="/technical/create-product"
              className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors"
            >
              Créer un composant
            </Link>
            <Link
              to="/technical/my-downloads"
              className="bg-green-600 text-white rounded-md px-4 py-2 font-medium hover:bg-green-500 transition-colors"
            >
              Mes téléchargements
            </Link>
          </div>
        </div>

        {/* Galerie de composants existante */}
        <div>
          {loading && (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && !error && components.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">
                Aucun composant disponible pour le moment.
              </p>
              <p className="text-sm mt-2">
                Commencez par{" "}
                <Link
                  to="/technical/create-product"
                  className="text-blue-600 hover:underline"
                >
                  créer votre premier composant
                </Link>
              </p>
            </div>
          )}

          {!loading && !error && components.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {components.map((component) => (
                <div
                  key={component._id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg mb-1">
                        {component.name || "Sans nom"}
                      </h3>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                        v{component.version || "1.0.0"}
                      </span>
                    </div>
                    <div className="flex items-center mb-2">
                      {component.category &&
                        getCategoryBadge(component.category)}
                      <span className="text-xs text-gray-500 ml-2">
                        Par {component.author || "Anonyme"}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {component.description || "Aucune description disponible"}
                    </p>
                    {component.tags && component.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {component.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex justify-end mt-2">
                      <a
                        href={component.downloadUrl}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          logger({
                            type: "info",
                            message: `Downloading component: ${
                              component.name || "Sans nom"
                            }`,
                            clientId_Zitadel: userId,
                          })
                        }
                      >
                        Télécharger
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section Service Technique */}
      <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4 text-yellow-800">
          Service Technique
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Logs et statistiques */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-yellow-700">
              Monitoring Docker
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="https://cesieat.nathan-lorit.com/dozzle/"
                className="text-blue-600 hover:underline"
              >
                État des containers
              </Link>
            </div>
          </div>

          {/* Infrastructure */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-2 text-yellow-700">
              Infrastructure
            </h3>
            <div className="flex flex-col gap-2">
              <Link
                to="/technical/logs"
                className="text-blue-600 hover:underline"
              >
                Logs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
