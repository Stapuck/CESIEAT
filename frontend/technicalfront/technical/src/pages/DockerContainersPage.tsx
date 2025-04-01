import React, { useState, useEffect } from 'react';
import FaPlay from "../assets/icons/play.fill.svg";
import FaStop from "../assets/icons/stop.circle.fill.svg";
import FaRedo from "../assets/icons/arrow.uturn.backward.svg";
import FaSearch from "../assets/icons/magnifyingglass.svg";
import FaExclamationTriangle from "../assets/icons/exclamationmark.triangle.fill.svg";

type ContainerStatus = 'running' | 'stopped' | 'restarting' | 'error';

interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: ContainerStatus;
  uptime: string;
  cpu: string;
  memory: string;
  ports: string;
  network: string;
}

// URL de l'API Docker (directement, sans Prometheus)
const DOCKER_API_URL = 'http://localhost:8080/api/docker';

const DockerContainersPage: React.FC = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<DockerContainer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(5000); // 5 secondes par défaut

  // Fonction pour récupérer les données des conteneurs depuis notre API Docker
  const fetchContainerData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Tentative de récupération des données depuis:', `${DOCKER_API_URL}/stats`);
      const response = await fetch(`${DOCKER_API_URL}/stats`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Réponse API non-OK:', response.status, errorText);
        throw new Error(`Erreur lors de la récupération des données: ${response.status}${errorText ? ' - ' + errorText : ''}`);
      }
      
      // Les données arrivent déjà formatées depuis notre API
      const data = await response.json();
      console.log('Données reçues:', data);
      setContainers(data);
      setLoading(false);
    } catch (err) {
      console.error('Erreur lors de la récupération des données:', err);
      
      

      setLoading(false);
    }
  };

  // Appeler l'API au chargement initial puis à intervalle régulier
  useEffect(() => {
    fetchContainerData();
    
    const intervalId = setInterval(fetchContainerData, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Ajouter une vérification de santé au chargement du composant
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await fetch(`${DOCKER_API_URL}/healthcheck`);
        if (response.ok) {
          console.log('API Docker en ligne et fonctionnelle');
        } else {
          console.error('API Docker répond, mais avec une erreur:', response.status);
        }
      } catch (err) {
        console.error('Impossible de contacter l\'API Docker:', err);
      }
    };
    
    checkApiHealth();
  }, []);

  // Appliquer les filtres quand les conteneurs ou les filtres changent
  useEffect(() => {
    let result = containers;
    
    // Appliquer le filtre de recherche
    if (searchTerm) {
      result = result.filter(container => 
        container.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        container.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
        container.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Appliquer le filtre de statut
    if (statusFilter !== 'all') {
      result = result.filter(container => container.status === statusFilter);
    }
    
    setFilteredContainers(result);
  }, [containers, searchTerm, statusFilter]);

  // Fonction pour gérer les actions sur les conteneurs
  const handleContainerAction = async (id: string, action: 'start' | 'stop' | 'restart') => {
    try {
      setError(null);
      
      // Appel à l'API Docker pour effectuer l'action
      const response = await fetch(`${DOCKER_API_URL}/containers/${id}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Erreur lors de l'action ${action}`);
      }
      
      // Mettre à jour l'état local pour refléter immédiatement l'action
      setContainers(prevContainers => 
        prevContainers.map(container => {
          if (container.id === id) {
            let newStatus: ContainerStatus = container.status;
            switch (action) {
              case 'start':
                newStatus = 'running';
                break;
              case 'stop':
                newStatus = 'stopped';
                break;
              case 'restart':
                newStatus = 'restarting';
                break;
            }
            return { ...container, status: newStatus };
          }
          return container;
        })
      );
      
      // Rafraîchir les données après un court délai pour refléter le changement d'état
      setTimeout(fetchContainerData, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  const getStatusBadgeClass = (status: ContainerStatus): string => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-gray-100 text-gray-800';
      case 'restarting':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">État des Containers Docker</h1>
        
        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button 
              className="font-bold" 
              onClick={() => setError(null)}
            >
              &times;
            </button>
          </div>
        )}
        
        {/* Contrôle du rafraîchissement */}
        <div className="mb-6 flex items-center">
          <label htmlFor="refreshInterval" className="mr-2 text-sm font-medium text-gray-700">
            Intervalle de rafraîchissement:
          </label>
          <select
            id="refreshInterval"
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(Number(e.target.value))}
            className="border rounded-md p-2 text-sm"
          >
            <option value={2000}>2 secondes</option>
            <option value={5000}>5 secondes</option>
            <option value={10000}>10 secondes</option>
            <option value={30000}>30 secondes</option>
          </select>
          <button
            onClick={fetchContainerData}
            className="ml-4 bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded text-sm"
          >
            Rafraîchir maintenant
          </button>
        </div>
        
        {/* Panneau de statuts */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-green-800 text-xl">
                  {containers.filter(c => c.status === 'running').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">En cours d'exécution</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-gray-100 rounded-full p-3">
                <span className="text-gray-800 text-xl">
                  {containers.filter(c => c.status === 'stopped').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">Arrêtés</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-yellow-800 text-xl">
                  {containers.filter(c => c.status === 'restarting').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">En redémarrage</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-3">
                <span className="text-red-800 text-xl">
                  {containers.filter(c => c.status === 'error').length}
                </span>
              </div>
              <div className="ml-3">
                <p className="text-sm text-gray-600">En erreur</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0 flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-sm font-medium text-gray-700">Statut :</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border rounded-md p-2 text-sm"
              >
                <option value="all">Tous</option>
                <option value="running">En cours d'exécution</option>
                <option value="stopped">Arrêtés</option>
                <option value="restarting">En redémarrage</option>
                <option value="error">En erreur</option>
              </select>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={FaSearch} alt="Search icon" width="16" height="16" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, image ou ID..."
                className="border rounded-md pl-10 pr-4 py-2 w-full md:w-64"
              />
            </div>
          </div>
        </div>
        
        {/* Tableau des containers */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
            </div>
          ) : filteredContainers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Aucun container ne correspond aux critères de recherche.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom / ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uptime</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPU / Mémoire</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ports</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Réseau</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredContainers.map((container) => (
                    <tr key={container.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{container.name}</div>
                        <div className="text-xs text-gray-500">{container.id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{container.image}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(container.status)}`}>
                          {container.status === 'running' && 'En cours'}
                          {container.status === 'stopped' && 'Arrêté'}
                          {container.status === 'restarting' && 'Redémarrage'}
                          {container.status === 'error' && (
                            <div className="flex items-center">
                              <img src={FaExclamationTriangle} alt="Error icon" width="12" height="12" className="mr-1" />
                              Erreur
                            </div>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {container.uptime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">CPU: {container.cpu}</div>
                        <div className="text-sm text-gray-500">Mémoire: {container.memory}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {container.ports}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {container.network}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex space-x-2">
                          {container.status !== 'running' && (
                            <button
                              onClick={() => handleContainerAction(container.id, 'start')}
                              className="text-green-600 hover:text-green-900"
                              title="Démarrer"
                            >
                              <img src={FaPlay} alt="Start icon" width="16" height="16" />
                            </button>
                          )}
                          {container.status === 'running' && (
                            <button
                              onClick={() => handleContainerAction(container.id, 'stop')}
                              className="text-red-600 hover:text-red-900"
                              title="Arrêter"
                            >
                              <img src={FaStop} alt="Stop icon" width="16" height="16" />
                            </button>
                          )}
                          <button
                            onClick={() => handleContainerAction(container.id, 'restart')}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Redémarrer"
                          >
                            <img src={FaRedo} alt="Restart icon" width="16" height="16" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
  );
};

export default DockerContainersPage;
