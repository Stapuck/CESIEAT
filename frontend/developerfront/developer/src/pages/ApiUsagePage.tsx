import { useState } from "react";
import { Link } from "react-router-dom";

const ApiUsagePage = () => {
  // État pour le filtre de période
  const [period, setPeriod] = useState("7days");

  // Données simulées pour les graphiques (normalement vous utiliseriez une bibliothèque comme Chart.js ou Recharts)
  const usageData = {
    "7days": {
      labels: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"],
      apiCalls: [120, 150, 200, 180, 250, 120, 100],
      errors: [5, 3, 8, 4, 12, 5, 3],
      endpointUsage: [
        { name: "/components", calls: 450 },
        { name: "/downloads", calls: 320 },
        { name: "/users", calls: 180 },
        { name: "/auth", calls: 170 }
      ]
    },
    "30days": {
      labels: ["Semaine 1", "Semaine 2", "Semaine 3", "Semaine 4"],
      apiCalls: [850, 920, 1050, 780],
      errors: [32, 45, 38, 27],
      endpointUsage: [
        { name: "/components", calls: 1250 },
        { name: "/downloads", calls: 980 },
        { name: "/users", calls: 620 },
        { name: "/auth", calls: 750 }
      ]
    },
    "90days": {
      labels: ["Janvier", "Février", "Mars"],
      apiCalls: [3200, 2800, 3500],
      errors: [120, 95, 145],
      endpointUsage: [
        { name: "/components", calls: 4200 },
        { name: "/downloads", calls: 2850 },
        { name: "/users", calls: 1220 },
        { name: "/auth", calls: 1230 }
      ]
    }
  };

  // Calculer les totaux pour la période sélectionnée
  const currentData = usageData[period as keyof typeof usageData];
  const totalCalls = currentData.apiCalls.reduce((sum, value) => sum + value, 0);
  const totalErrors = currentData.errors.reduce((sum, value) => sum + value, 0);
  const errorRate = ((totalErrors / totalCalls) * 100).toFixed(1);

  // Quota simulé
  const quota = {
    limit: 10000,
    used: totalCalls,
    remaining: 10000 - totalCalls
  };

  // Fonction pour simuler un graphique simple (à remplacer par une vraie bibliothèque de graphiques)
  const renderSimpleChart = (values: number[], maxHeight: number = 150) => {
    const max = Math.max(...values);
    const scale = maxHeight / (max || 1); // Éviter la division par zéro

    return (
      <div className="flex items-end h-40 gap-1">
        {values.map((value, index) => (
          <div 
            key={index} 
            className="bg-blue-500 rounded-t w-full"
            style={{ height: `${value * scale}px` }}
            title={`${value} appels`}
          ></div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Statistiques d'Utilisation API</h1>
        <p className="text-gray-600">Analysez votre utilisation de l'API et surveillez vos quotas</p>
      </div>

      {/* Contrôles de filtre */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Vue d'ensemble</h2>
          <div className="flex gap-2">
            <button 
              className={`px-3 py-1.5 rounded-md ${period === '7days' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setPeriod('7days')}
            >
              7 jours
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md ${period === '30days' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setPeriod('30days')}
            >
              30 jours
            </button>
            <button 
              className={`px-3 py-1.5 rounded-md ${period === '90days' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
              onClick={() => setPeriod('90days')}
            >
              90 jours
            </button>
          </div>
        </div>

        {/* Indicateurs de performance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total des appels API</p>
            <p className="text-2xl font-bold text-blue-700">{totalCalls.toLocaleString()}</p>
            <div className="mt-2 text-sm">
              {period === '7days' ? '7 derniers jours' : period === '30days' ? '30 derniers jours' : '90 derniers jours'}
            </div>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Taux d'erreur</p>
            <p className="text-2xl font-bold text-red-700">{errorRate}%</p>
            <div className="mt-2 text-sm">
              {totalErrors.toLocaleString()} erreurs sur {totalCalls.toLocaleString()} appels
            </div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Quota restant</p>
            <p className="text-2xl font-bold text-green-700">{quota.remaining.toLocaleString()}</p>
            <div className="mt-2 text-sm">
              {Math.round((quota.used / quota.limit) * 100)}% utilisé ce mois-ci
            </div>
          </div>
        </div>

        {/* Graphique d'utilisation */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Appels API par {period === '7days' ? 'jour' : period === '30days' ? 'semaine' : 'mois'}</h3>
          {renderSimpleChart(currentData.apiCalls)}
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            {currentData.labels.map((label, index) => (
              <div key={index} className="text-center" style={{ width: '100%' }}>{label}</div>
            ))}
          </div>
        </div>

        {/* Liens vers d'autres pages */}
        <div className="flex justify-end gap-4 mt-4">
          <Link to="/developer/api-keys" className="text-blue-600 hover:underline">
            Gérer mes clés API
          </Link>
          <Link to="/developer/api-documentation" className="text-blue-600 hover:underline">
            Consulter la documentation
          </Link>
        </div>
      </div>

      {/* Détails de l'utilisation par point d'entrée */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Utilisation par Point d'Entrée</h2>
          <div className="space-y-4">
            {currentData.endpointUsage.map((endpoint, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{endpoint.name}</p>
                  <p className="text-sm text-gray-500">{endpoint.calls.toLocaleString()} appels</p>
                </div>
                <div className="w-1/2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ 
                        width: `${Math.min((endpoint.calls / totalCalls) * 100, 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Alertes et Notifications</h2>
          
          {quota.used > quota.limit * 0.8 ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Alerte: Vous avez utilisé plus de 80% de votre quota mensuel.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Votre utilisation d'API est dans les limites normales.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <p className="text-sm">Seuils d'alerte configurés:</p>
            <div className="flex items-center justify-between text-sm">
              <span>Alerte à 80% du quota</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Activé</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Notification d'erreurs anormales</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full">Activé</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Rapport hebdomadaire par email</span>
              <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded-full">Désactivé</span>
            </div>
          </div>
          
          <div className="mt-4">
            <Link to="/developer/profile/settings" className="text-blue-600 hover:underline text-sm">
              Configurer les alertes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiUsagePage;
