import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaWalking, FaTrash, FaRedoAlt, FaMapMarkerAlt, FaQrcode } from "react-icons/fa";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Importer leaflet-ant-path après Leaflet
import "leaflet-ant-path";

// Correction pour les icônes Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import LocateIcon from "../assets/icons/mappin.and.ellipse.circle.fill.svg";
import Refresh from "../assets/icons/arrow.trianglehead.2.clockwise.svg";
import CompteLogo from "../assets/icons/person.crop.circle.svg";
import CommandeItem from "../components/CommandeItem";

// Configuration de l'icône par défaut pour Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Créer des icônes personnalisées
const RestaurantIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ClientIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icône pour la position actuelle
const CurrentLocationIcon = L.icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface ICommande {
  _id: string;
  client: number;
  restaurant: number;
  livreur?: number;
  menu: any[];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IClient {
  _id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
  position?: [number, number]; // Ajout de la position
}

interface IRestaurateur {
  _id: number;
  managerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  phone: string;
  url: string; // Utilisé pour l'image du restaurant
  ville: string; // Ajout de la propriété ville
  position?: [number, number]; // Ajout de la position
}

interface IRestaurantLocation {
  id: number;
  name: string;
  position: [number, number]; // [latitude, longitude]
}

interface IRoute {
  id: string;
  from: [number, number];
  to: [number, number];
  commandeId: string;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [restaurateurs, setRestaurateur] = useState<IRestaurateur[]>([]);
  const [restaurantLocations, setRestaurantLocations] = useState<
    IRestaurantLocation[]
  >([]);
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<
    [number, number] | null
  >(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [hiddenCommandes, setHiddenCommandes] = useState<string[]>([]);

  // Référence pour le conteneur de la carte
  const mapRef = useRef<HTMLDivElement>(null);
  // Référence pour l'instance de la carte Leaflet
  const mapInstanceRef = useRef<L.Map | null>(null);
  // Référence pour stocker les chemins animés
  const antPathsRef = useRef<any[]>([]);
  // Référence pour le marqueur de position actuelle
  const currentLocationMarkerRef = useRef<L.Marker | null>(null);

  // Charger toutes les données au chargement de la page
  useEffect(() => {
    loadAllData();
    // Obtenir la géolocalisation de l'utilisateur
    getCurrentLocation();
  }, []);

  // Fonction pour charger toutes les données
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([getCommandes(), getClients(), getRestaurateurs()]);
      setIsLoading(false);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      setIsLoading(false);
    }
  };

  // Récupérer les commandes disponibles (seulement Préparation et Prêt)
  const getCommandes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/commandes");
      // Filtrer pour n'inclure que les statuts "Préparation" et "Prêt"
      const filteredCommandes = response.data.filter(
        (cmd: ICommande) =>
          cmd.status === "Préparation" || cmd.status === "Prêt"
      );
      setCommandes(filteredCommandes);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients");
      // Ajouter des positions simulées pour les clients (à remplacer par des données réelles)
      const clientsWithPositions = response.data.map((client: any) => ({
        ...client,
        position: [
          48.8566 + (Math.random() - 0.5) * 0.05,
          2.3522 + (Math.random() - 0.5) * 0.05,
        ] as [number, number],
      }));

      setClients(clientsWithPositions);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const getRestaurateurs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/restaurateurs"
      );
      // Ajouter des positions simulées pour les restaurants (à remplacer par des données réelles)
      const restaurateursWithPositions = response.data.map((resto: any) => ({
        ...resto,
        position: [
          48.8566 + (Math.random() - 0.5) * 0.05,
          2.3522 + (Math.random() - 0.5) * 0.05,
        ] as [number, number],
      }));

      console.log(
        "Restaurateurs avec positions:",
        restaurateursWithPositions
      );
      setRestaurateur(restaurateursWithPositions);
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurateurs:", error);
    }
  };

  // Obtenir la géolocalisation de l'utilisateur
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
          setLocationError(null);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError("Impossible d'obtenir votre position actuelle.");
          // Position par défaut (Paris)
          setCurrentLocation([48.8566, 2.3522]);
        }
      );
    } else {
      setLocationError(
        "La géolocalisation n'est pas prise en charge par ce navigateur."
      );
      // Position par défaut (Paris)
      setCurrentLocation([48.8566, 2.3522]);
    }
  };

  // Générer les itinéraires entre restaurants et clients
  useEffect(() => {
    if (
      commandes.length > 0 &&
      restaurateurs.length > 0 &&
      clients.length > 0
    ) {
      const newRoutes: IRoute[] = [];

      commandes.forEach((commande) => {
        const restaurant = restaurateurs.find(
          (r) => r._id === commande.restaurant
        );
        const client = clients.find((c) => c._id === commande.client);

        if (restaurant?.position && client?.position) {
          newRoutes.push({
            id: `${commande._id}-route`,
            from: restaurant.position,
            to: client.position,
            commandeId: commande._id,
          });
        }
      });

      setRoutes(newRoutes);
    }
  }, [commandes, restaurateurs, clients]);

  // Initialiser la carte
  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstanceRef.current) {
      // Centre de la carte (position actuelle ou Paris par défaut)
      const defaultPosition: [number, number] = currentLocation || [
        48.8566, 2.3522,
      ];

      // Créer la carte
      mapInstanceRef.current = L.map(mapRef.current).setView(
        defaultPosition,
        13
      );

      // Ajouter le fond de carte
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);
    }

    // Nettoyage lors du démontage du composant
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Mettre à jour les marqueurs et routes lorsque les données changent
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    // Supprimer les anciens chemins animés
    antPathsRef.current.forEach((path) => path.remove());
    antPathsRef.current = [];

    // Nettoyer les couches existantes sauf le fond de carte
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) return;
      map.removeLayer(layer);
    });

    // Ajouter le marqueur de position actuelle
    if (currentLocation) {
      if (currentLocationMarkerRef.current) {
        currentLocationMarkerRef.current.remove();
      }

      currentLocationMarkerRef.current = L.marker(currentLocation, {
        icon: CurrentLocationIcon,
      })
        .addTo(map)
        .bindPopup("Votre position actuelle");
    }

    // Ajouter les marqueurs des restaurants
    restaurateurs
      .filter((resto) => commandes.some((cmd) => cmd.restaurant === resto._id))
      .forEach((resto) => {
        if (resto.position) {
          L.marker(resto.position, { icon: RestaurantIcon })
            .addTo(map)
            .bindPopup(`<b>${resto.restaurantName}</b><br>${resto.address}`);
        }
      });

    // Ajouter les marqueurs des clients
    clients
      .filter((client) => commandes.some((cmd) => cmd.client === client._id))
      .forEach((client) => {
        if (client.position) {
          L.marker(client.position, { icon: ClientIcon })
            .addTo(map)
            .bindPopup(`<b>${client.name}</b><br>${client.address}`);
        }
      });

    

  }, [restaurateurs, clients, routes, selectedCommande, currentLocation]);

  // Fonction pour gérer la sélection d'une commande
  const handleSelectCommande = (commandeId: string) => {
    if (selectedCommande === commandeId) {
      setSelectedCommande(null);
    } else {
      setSelectedCommande(commandeId);

      // Trouver la route correspondante et centrer la carte
      const route = routes.find((r) => r.commandeId === commandeId);
      if (route && mapInstanceRef.current) {
        const bounds = L.latLngBounds([route.from, route.to]);
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  };

  // Masquer une commande
  const hideCommande = (commandeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenCommandes((prev) => [...prev, commandeId]);
  };

  // Rafraîchir la position actuelle
  const refreshCurrentLocation = () => {
    getCurrentLocation();
  };

  // Filtrer les commandes masquées
  const visibleCommandes = commandes.filter(
    (cmd) => !hiddenCommandes.includes(cmd._id)
  );

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-secondary flex justify-between w-full p-4 my-3 items-center rounded-xl">
        <h1 className="text-xl font-bold">Livraisons disponibles</h1>
        <div className="flex items-center">
          <Link to="/livreur/scan" className="mr-4">
            <div className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600">
              <FaQrcode className="text-lg mr-2" />
              <span>Scanner</span>
            </div>
          </Link>
          <Link to="/livreur/account">
            <img src={LocateIcon} className="w-10" alt="Position" />
          </Link>
        </div>
      </div>

      <div className="  w-full pt-4 rounded-b-xl ">
        {/* Carte interactive */}
        <div className="relative mb-4 flex flex-col items-center ">
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg shadow-inner border border-gray-200"
            style={{ height: "300px" }}
          ></div>

          {/* Bouton pour rafraîchir la position */}
          <button
            onClick={refreshCurrentLocation}
            className="  flex items-center justify-between right-2 bg-white mt-2 p-2 px-4 rounded-2xl shadow-md hover:bg-gray-100"
            title="Actualiser ma position"
          >
            Actualiser ma position
            <img src={Refresh} alt="Refresh" className=" ml-3 w-5 h-5" />
          </button>

          {/* Message d'erreur de localisation */}
          {locationError && (
            <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
              {locationError}
            </div>
          )}
        </div>

        {/* Liste des commandes disponibles */}
        <h2 className="text-lg font-semibold mb-2">
          Commandes disponibles ({visibleCommandes.length})
        </h2>

        <div className="space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {visibleCommandes.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Aucune commande disponible pour le moment.
                </div>
              ) : (
                visibleCommandes.map((commande) => {
                  const restaurant = restaurateurs.find(
                    (r) => r._id === commande.restaurant
                  );
                  const client = clients.find((c) => c._id === commande.client);

                  return (
                    <CommandeItem
                      key={commande._id}
                      commande={commande}
                      restaurant={restaurant}
                      client={client}
                      isSelected={selectedCommande === commande._id}
                      onSelect={handleSelectCommande}
                      onHide={hideCommande}
                    />
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
