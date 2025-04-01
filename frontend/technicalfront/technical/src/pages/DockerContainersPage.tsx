import React, { useState, useEffect } from "react";
import axios from "axios";
import FaPlay from "../assets/icons/play.fill.svg";
import FaStop from "../assets/icons/stop.circle.fill.svg";
import FaRedo from "../assets/icons/arrow.uturn.backward.svg";
import FaSearch from "../assets/icons/magnifyingglass.svg";
import FaExclamationTriangle from "../assets/icons/exclamationmark.triangle.fill.svg";

type ContainerStatus = "running" | "stopped" | "restarting" | "error";

interface DockerContainer {
  id: string;
  name: string;
  uuid: string; // New property to store UUID
  image: string;
  status: ContainerStatus;
  uptime: string;
  cpu: string;
  memory: string;
  ports: string;
  network: string;
}

// URL de l'API cAdvisor via le proxy Nginx
const CADVISOR_API_URL = "/api/v1.3/docker";

const DockerContainersPage: React.FC = () => {
  const [containers, setContainers] = useState<DockerContainer[]>([]);
  const [filteredContainers, setFilteredContainers] = useState<
    DockerContainer[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(10000); // 10 secondes par défaut
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Fonction pour récupérer les données des conteneurs depuis cAdvisor
  const fetchContainerData = async () => {
    try {
      // Ne pas définir setLoading(true) ici pour éviter le clignotement à chaque rafraîchissement
      setError(null);

      const response = await axios.get(CADVISOR_API_URL);

      // Transformer les données du format cAdvisor au format attendu par l'application
      const newContainerData = formatCAdvisorData(response.data);

      // Compare les nouvelles données avec les anciennes pour éviter les mises à jour inutiles
      if (JSON.stringify(newContainerData) !== JSON.stringify(containers)) {
        setContainers(newContainerData);
        setLastUpdated(new Date());
      }

      // Définir loading à false après avoir récupéré les données
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des données:", err);
      const errorMessage = axios.isAxiosError(err)
        ? `Erreur lors de la récupération des données: ${
            err.response?.status || ""
          } ${err.response?.data || err.message}`
        : "Impossible de récupérer les données des conteneurs";
      setError(errorMessage);

      // Définir loading à false même en cas d'erreur
      setLoading(false);
    }
  };

  // Fonction utilitaire pour extraire l'UUID d'un nom de conteneur
  const extractUUID = (containerName: string): string => {
    // Vérifie si le nom suit le pattern "/docker/[UUID]" et exclut "/docker"
    const uuidRegex = /\/docker\/([a-f0-9]{12,})/i;

    const match = containerName.match(uuidRegex);

    // Si un UUID valide est trouvé, le retourner, sinon retourner le nom original
    return match && match[1].length >= 12 ? match[1] : containerName;
  };

  // Fonction pour formater la taille de la mémoire en KB, MB, GB ou TB selon la taille
  const formatMemorySize = (bytes: number): string => {
    if (bytes === 0) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    // Ne pas dépasser l'index du tableau des unités
    const unitIndex = Math.min(i, units.length - 1);

    // Convertir en unité appropriée et formater avec 2 décimales
    return `${(bytes / Math.pow(1024, unitIndex)).toFixed(2)} ${
      units[unitIndex]
    }`;
  };

  // Fonction pour transformer les données de cAdvisor au format attendu
  const formatCAdvisorData = (cadvisorData: any): DockerContainer[] => {
    if (!cadvisorData) return [];

    // Filtrer et transformer les données
    return Object.values(cadvisorData)
      .filter((container: any) => {
        // Exclure les entrées "/docker" et celles commençant par "/docker/"
        const containerName = container.name || "";
        return (
          containerName !== "/docker" &&
          containerName !== "/docker/buildkit" &&
          containerName !== "/docker/buildx"
        );
      })
      .map((container: any, index) => {
        // Extraire les informations nécessaires du format cAdvisor
        const spec = container.spec || {};
        const stats =
          container.stats && container.stats.length > 0
            ? container.stats[container.stats.length - 1]
            : {};

        // Assurer un ID unique pour chaque conteneur
        const uniqueId = container.id || container.name || `container-${index}`;

        // Récupérer le nom explicite à partir des aliases
        let displayName = container.name || uniqueId;
        if (spec.aliases && spec.aliases.length > 0) {
          // Le premier alias est généralement le nom défini dans container_name
          displayName = spec.aliases[0];
        }

        // Déterminer le statut à partir des données disponibles
        let status: ContainerStatus = "stopped";
        if (stats.cpu && stats.memory) {
          status = "running";
        } else if (container.id && container.name && !stats.cpu) {
          status = "stopped";
        }

        // Calculer l'utilisation CPU et mémoire
        const cpuUsage = stats.cpu
          ? `${(stats.cpu.usage.total / 1000000000).toFixed(2)}%`
          : "0%";

        // Format amélioré de la mémoire
        const memoryUsed = stats.memory ? stats.memory.usage : 0;
        const memoryLimit = spec.memory?.limit || 0;

        const formattedMemoryUsed = formatMemorySize(memoryUsed);
        const formattedMemoryLimit =
          memoryLimit > 0 ? formatMemorySize(memoryLimit) : "∞";
        const memoryUsage = `${formattedMemoryUsed} `;

        // Extraire les informations de ports
        const ports = spec.ports
          ? spec.ports
              .map((p: any) => `${p.hostPort}:${p.containerPort}`)
              .join(", ")
          : "";

        // Calculer l'uptime
        const creationTime = container.creation_time
          ? new Date(container.creation_time * 1000)
          : new Date();
        const now = new Date();
        const uptimeMs = now.getTime() - creationTime.getTime();
        const uptimeHours = Math.floor(uptimeMs / (1000 * 60 * 60));
        const uptimeMinutes = Math.floor(
          (uptimeMs % (1000 * 60 * 60)) / (1000 * 60)
        );
        const uptime = `${uptimeHours}h ${uptimeMinutes}m`;

        // Récupérer le nom et extraire l'UUID si le format est "/docker/[UUID]"
        const containerName = container.name || uniqueId;
        const uuid = extractUUID(containerName);

        return {
          id: uniqueId,
          name: displayName, // Utiliser le nom explicite du conteneur
          uuid: uuid, // Conserver l'UUID pour référence
          image: spec.image || "unknown",
          status,
          uptime,
          cpu: cpuUsage,
          memory: memoryUsage,
          ports,
          network: Object.keys(stats.network || {}).join(", ") || "none",
        };
      });
  };

  // Appeler l'API au chargement initial puis à intervalle régulier
  useEffect(() => {
    fetchContainerData();

    const intervalId = setInterval(fetchContainerData, refreshInterval);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Ajouter une vérification de santé au chargement du composant
  useEffect(() => {}, []);

  // Appliquer les filtres quand les conteneurs ou les filtres changent
  useEffect(() => {
    let result = containers;

    // Appliquer le filtre de recherche
    if (searchTerm) {
      result = result.filter(
        (container) =>
          container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          container.image.toLowerCase().includes(searchTerm.toLowerCase()) ||
          container.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          container.uuid.toLowerCase().includes(searchTerm.toLowerCase()) // Ajout de la recherche par UUID
      );
    }

    // Appliquer le filtre de statut
    if (statusFilter !== "all") {
      result = result.filter((container) => container.status === statusFilter);
    }

    setFilteredContainers(result);
  }, [containers, searchTerm, statusFilter]);

  // Fonction pour gérer les actions sur les conteneurs
  const handleContainerAction = async (
    id: string,
    action: "start" | "stop" | "restart"
  ) => {
    try {
      setError(null);

      // Note: cAdvisor est principalement une API en lecture seule - les actions réelles
      // nécessiteraient une API Docker séparée ou une implémentation API spécifique
      setError(
        "Les actions sur les conteneurs ne sont pas disponibles directement via cAdvisor. Utilisez Docker CLI ou Docker Desktop."
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
      console.error(errorMessage);
    }
  };

  const getStatusBadgeClass = (status: ContainerStatus): string => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "stopped":
        return "bg-gray-100 text-gray-800";
      case "restarting":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        État des Containers Docker via cAdvisor
      </h1>

      {/* Affichage des erreurs */}
      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button className="font-bold" onClick={() => setError(null)}>
            &times;
          </button>
        </div>
      )}

      {/* Contrôle du rafraîchissement */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <div className="flex items-center">
          <label
            htmlFor="refreshInterval"
            className="mr-2 text-sm font-medium text-gray-700"
          >
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
        </div>

        <div className="flex items-center">
          <button
            onClick={fetchContainerData}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-4 rounded text-sm"
          >
            Rafraîchir maintenant
          </button>
          <span className="ml-2 text-xs text-gray-500">
            Dernière mise à jour: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Panneau de statuts */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <span className="text-green-800 text-xl">
                {containers.filter((c) => c.status === "running").length}
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
                {containers.filter((c) => c.status === "stopped").length}
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
                {containers.filter((c) => c.status === "restarting").length}
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
                {containers.filter((c) => c.status === "error").length}
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
            <label
              htmlFor="statusFilter"
              className="mr-2 text-sm font-medium text-gray-700"
            >
              Statut :
            </label>
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
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Nom / ID
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Statut
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Uptime
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    CPU / Mémoire
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContainers.map((container) => (
                  <tr key={container.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {container.name.includes("/docker/")
                          ? `Container ${container.uuid.substring(0, 12)}...`
                          : container.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {container.uuid !== container.name
                          ? container.uuid
                          : container.id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {container.image}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(
                          container.status
                        )}`}
                      >
                        {container.status === "running" && "En cours"}
                        {container.status === "stopped" && "Arrêté"}
                        {container.status === "restarting" && "Redémarrage"}
                        {container.status === "error" && (
                          <div className="flex items-center">
                            <img
                              src={FaExclamationTriangle}
                              alt="Error icon"
                              width="12"
                              height="12"
                              className="mr-1"
                            />
                            Erreur
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {container.uptime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        CPU: {container.cpu}
                      </div>
                      <div className="text-sm text-gray-500">
                        Mémoire: {container.memory}
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
