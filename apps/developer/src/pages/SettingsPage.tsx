import { useState } from "react";
import { Link } from "react-router-dom";

const SettingsPage = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    apiUsageAlerts: true,
    securityAlerts: true,
    marketingEmails: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: "30"
  });

  const [dangerZoneOpen, setDangerZoneOpen] = useState(false);

  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSecurityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const newValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setSecurity(prev => ({
      ...prev,
      [name]: newValue
    }));
  };

  const saveSettings = () => {
    // Simulation de sauvegarde (à remplacer par un appel API)
    setTimeout(() => {
      alert("Paramètres sauvegardés avec succès !");
    }, 500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Paramètres du Compte</h1>
        <p className="text-gray-600">Configurez vos préférences et options de sécurité</p>
      </div>

      {/* Section des notifications */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Préférences de notification</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Mises à jour par email</h3>
              <p className="text-sm text-gray-500">Recevoir des emails concernant les mises à jour de la plateforme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="emailUpdates"
                checked={notifications.emailUpdates}
                onChange={handleNotificationChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Alertes d'utilisation d'API</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications lorsque votre utilisation d'API atteint certains seuils</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="apiUsageAlerts"
                checked={notifications.apiUsageAlerts}
                onChange={handleNotificationChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Alertes de sécurité</h3>
              <p className="text-sm text-gray-500">Recevoir des notifications en cas d'activités suspectes sur votre compte</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="securityAlerts"
                checked={notifications.securityAlerts}
                onChange={handleNotificationChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Emails marketing</h3>
              <p className="text-sm text-gray-500">Recevoir des offres spéciales et informations promotionnelles</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="marketingEmails"
                checked={notifications.marketingEmails}
                onChange={handleNotificationChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Section de sécurité */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Sécurité</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Authentification à deux facteurs</h3>
              <p className="text-sm text-gray-500">Renforce la sécurité de votre compte en exigeant un code supplémentaire lors de la connexion</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                name="twoFactorAuth"
                checked={security.twoFactorAuth}
                onChange={handleSecurityChange}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Expiration de session</h3>
              <p className="text-sm text-gray-500">Durée après laquelle une session inactive se déconnecte automatiquement</p>
            </div>
            <select 
              name="sessionTimeout"
              value={security.sessionTimeout}
              onChange={handleSecurityChange}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="60">1 heure</option>
              <option value="120">2 heures</option>
              <option value="1440">24 heures</option>
            </select>
          </div>

          <div className="pt-4">
            <Link to="/developer/api-keys" className="text-blue-600 hover:underline">
              Gérer mes clés API →
            </Link>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-red-200 border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-red-600">Zone de danger</h2>
          <button 
            onClick={() => setDangerZoneOpen(!dangerZoneOpen)} 
            className="text-sm text-gray-600 hover:underline"
          >
            {dangerZoneOpen ? 'Masquer' : 'Afficher'}
          </button>
        </div>
        
        {dangerZoneOpen && (
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-600 mb-2">Supprimer mon compte</h3>
              <p className="text-sm text-gray-600 mb-4">Cette action supprimera définitivement votre compte et toutes les données associées. Cette opération est irréversible.</p>
              <button className="bg-red-600 text-white rounded-md px-4 py-2 font-medium hover:bg-red-500 transition-colors">
                Supprimer mon compte
              </button>
            </div>
            
            <div className="p-4 border border-red-200 rounded-lg">
              <h3 className="font-medium text-red-600 mb-2">Révoquer toutes les clés API</h3>
              <p className="text-sm text-gray-600 mb-4">Cette action désactivera toutes vos clés API actuelles. Toutes les applications utilisant ces clés cesseront de fonctionner.</p>
              <button className="bg-red-600 text-white rounded-md px-4 py-2 font-medium hover:bg-red-500 transition-colors">
                Révoquer toutes les clés
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bouton de sauvegarde */}
      <div className="flex justify-end">
        <button 
          onClick={saveSettings}
          className="bg-blue-700 text-white rounded-md px-6 py-2 font-medium hover:bg-blue-500 transition-colors"
        >
          Enregistrer tous les paramètres
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
