import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "react-oidc-context";
import { useLogger } from "../hooks/useLogger";

interface IClient {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isPaused: boolean;
  clientId_Zitadel: string;
  createdAt?: string; // Pour la date d'inscription
}

const ProfilePage = () => {
  const [clientInfo, setClientInfo] = useState<IClient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<IClient>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = useAuth();
  const logger = useLogger();

  // Statistiques fictives (à remplacer par des vraies données si disponible)
  const stats = {
    apiKeyCount: 3,
    projectsCount: 8,
    downloadsCount: 42
  };

  const getClientInfo = async () => {
    if (!auth.user?.profile.sub) return;
    
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://localhost/api/clients/byZitadelId/${auth.user.profile.sub}`
      );
      setClientInfo(response.data);
      setFormData({
        name: response.data.name,
        email: response.data.email,
        phone: response.data.phone,
        address: response.data.address
      });
      setError(null);
    } catch (err: any) {
      logger({
        type: "error",
        message: "Erreur lors de la récupération des informations client: " + err.message,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      setError("Impossible de charger les informations de votre profil");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.user?.profile.sub) {
      getClientInfo();
    }
  }, [auth.user?.profile.sub]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientInfo?._id) return;

    try {
      await axios.put(
        `https://localhost/api/clients/${clientInfo._id}`,
        formData
      );
      setClientInfo({ ...clientInfo, ...formData as IClient });
      setIsEditing(false);
      setError(null);
    } catch (err: any) {
      logger({
        type: "error",
        message: "Erreur lors de la mise à jour du profil: " + err.message,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      setError("La mise à jour du profil a échoué");
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("fr-FR");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-600">Chargement de votre profil...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon Profil</h1>
        <p className="text-gray-600">Consultez et gérez les informations de votre compte</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{clientInfo?.name || "Profil client"}</h2>
            {clientInfo?.address && <p className="text-gray-600">{clientInfo.address}</p>}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSubmit}
                  className="bg-green-600 text-white rounded-md px-4 py-2 font-medium hover:bg-green-500 transition-colors"
                >
                  Enregistrer
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 font-medium hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors"
                >
                  Modifier
                </button>
                <Link to="/developer/profile/settings" className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 font-medium hover:bg-gray-300 transition-colors">
                  Paramètres
                </Link>
              </>
            )}
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-500 mb-1">Nom</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name || ""} 
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email || ""} 
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-500 mb-1">Téléphone</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone || ""} 
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                </div>
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-500 mb-1">Adresse</label>
                  <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={formData.address || ""} 
                    onChange={handleChange}
                    className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.apiKeyCount}</p>
                  <p className="text-sm text-gray-500">Clés API</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.projectsCount}</p>
                  <p className="text-sm text-gray-500">Projets</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.downloadsCount}</p>
                  <p className="text-sm text-gray-500">Téléchargements</p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{clientInfo?.email || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p>{clientInfo?.phone || "Non spécifié"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Adresse</p>
                  <p>{clientInfo?.address || "Non spécifiée"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Membre depuis</p>
                  <p>{formatDate(clientInfo?.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut du compte</p>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full mr-2 ${clientInfo?.isPaused ? "bg-yellow-500" : "bg-green-500"}`}></span>
                    <span>{clientInfo?.isPaused ? "Compte en pause" : "Actif"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.apiKeyCount}</p>
                  <p className="text-sm text-gray-500">Clés API</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.projectsCount}</p>
                  <p className="text-sm text-gray-500">Projets</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="font-bold text-xl">{stats.downloadsCount}</p>
                  <p className="text-sm text-gray-500">Téléchargements</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link to="/developer/api-keys" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Mes clés API</h3>
          <p className="text-gray-600 mb-2">Gérez vos clés d'API pour l'intégration</p>
          <span className="text-blue-600">Accéder →</span>
        </Link>
        
        <Link to="/developer/my-downloads" className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-xl font-bold mb-2">Mes téléchargements</h3>
          <p className="text-gray-600 mb-2">Consultez les composants téléchargés</p>
          <span className="text-blue-600">Accéder →</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfilePage;
