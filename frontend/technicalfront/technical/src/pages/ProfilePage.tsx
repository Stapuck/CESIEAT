import { Link } from "react-router-dom";

const ProfilePage = () => {
  // Ces données seraient normalement chargées depuis une API
  const developerProfile = {
    name: "Jean Dupont",
    company: "Tech Solutions",
    email: "jean.dupont@example.com",
    role: "Développeur Senior",
    joinedDate: "12/03/2022",
    apiKeyCount: 3,
    projectsCount: 8,
    downloadsCount: 42
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Mon Profil Développeur</h1>
        <p className="text-gray-600">Consultez et gérez les informations de votre compte</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{developerProfile.name}</h2>
            <p className="text-gray-600">{developerProfile.company}</p>
          </div>
          <div className="flex gap-2">
            <Link to="/developer/profile/edit" className="bg-blue-700 text-white rounded-md px-4 py-2 font-medium hover:bg-blue-500 transition-colors">
              Modifier le profil
            </Link>
            <Link to="/developer/profile/settings" className="bg-gray-200 text-gray-700 rounded-md px-4 py-2 font-medium hover:bg-gray-300 transition-colors">
              Paramètres
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p>{developerProfile.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Rôle</p>
                <p>{developerProfile.role}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Membre depuis</p>
                <p>{developerProfile.joinedDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-bold text-xl">{developerProfile.apiKeyCount}</p>
                <p className="text-sm text-gray-500">Clés API</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-bold text-xl">{developerProfile.projectsCount}</p>
                <p className="text-sm text-gray-500">Projets</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="font-bold text-xl">{developerProfile.downloadsCount}</p>
                <p className="text-sm text-gray-500">Téléchargements</p>
              </div>
            </div>
          </div>
        </div>
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
