import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import axios from "axios";

interface IDownload {
  _id: string;
  componentId: {
    _id: string;
    name: string;
    version: string;
    description: string;
    category: string;
    author: string;
    tags: string[];
    filePath: string;
  };
  userId: string;
  downloadDate: string;
  componentName: string;
  componentVersion: string;
}

const MyDownloadsPage: React.FC = () => {
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const auth = useAuth();

  useEffect(() => {
    const fetchDownloads = async () => {
      if (!auth.user?.profile.sub) {
        setError("Utilisateur non connecté");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://cesieat.com/api/components/downloads/${auth.user.profile.sub}`
        );
        setDownloads(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des téléchargements:", err);
        setError("Impossible de charger vos téléchargements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDownloads();
  }, [auth.user?.profile.sub]);

  // Récupérer les catégories uniques
  const categories = [...new Set(downloads.map((dl) => dl.componentId?.category).filter(Boolean))];

  // Filtrer les téléchargements
  const filteredDownloads = downloads.filter((download) => {
    const matchesSearch =
      !searchTerm ||
      download.componentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (download.componentId?.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !selectedCategory || download.componentId?.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleDownloadAgain = async (componentId: string) => {
    try {
      window.open(
        `https://cesieat.com/api/components/download/${componentId}?userId=${auth.user?.profile.sub}`,
        "_blank"
      );
    } catch (err) {
      console.error("Erreur lors du téléchargement:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-4">Chargement de vos téléchargements...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mes Téléchargements</h1>
        <p className="text-gray-600">Historique des composants que vous avez téléchargés</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Composants téléchargés</h2>
            <Link to="/technical/components" className="text-blue-600 hover:underline">
              Explorer plus de composants
            </Link>
          </div>

          {/* Filtres et recherche */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Rechercher
              </label>
              <input
                type="text"
                id="search"
                placeholder="Rechercher un composant..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="md:w-1/3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Toutes les catégories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredDownloads.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                {downloads.length === 0
                  ? "Vous n'avez pas encore téléchargé de composants"
                  : "Aucun téléchargement ne correspond à votre recherche"}
              </p>
              {(searchTerm || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                  className="mt-4 text-blue-600 hover:underline"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDownloads.map((download) => (
                <div key={download._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{download.componentName}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {download.componentVersion}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    Téléchargé le {formatDate(download.downloadDate)}
                  </p>
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Catégorie</p>
                      <p className="text-sm">{download.componentId?.category || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Auteur</p>
                      <p className="text-sm">{download.componentId?.author || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Tags</p>
                      <p className="text-sm">
                        {download.componentId?.tags?.join(", ") || "Aucun"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/technical/component/${download.componentId?._id}`}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      Voir les détails
                    </Link>
                    <button
                      onClick={() => handleDownloadAgain(download.componentId._id)}
                      className="text-green-600 text-sm hover:underline"
                    >
                      Télécharger à nouveau
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyDownloadsPage;
