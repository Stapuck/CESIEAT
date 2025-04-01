import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaWalking, FaTrash, FaRedoAlt, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// Importer leaflet-ant-path après Leaflet
import 'leaflet-ant-path';

// Correction pour les icônes Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// Configuration de l'icône par défaut pour Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// Créer des icônes personnalisées
const RestaurantIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ClientIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Icône pour la position actuelle
const CurrentLocationIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
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
  menu: [];
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
  const [restaurantLocations, setRestaurantLocations] = useState<IRestaurantLocation[]>([]);
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [selectedCommande, setSelectedCommande] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<[number, number] | null>(null);
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
    setIsLoading(true);
    try {
      await Promise.all([
        getCommandes(),
        getClients(),
        getRestaurateurs()
      ]);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtenir la position actuelle de l'utilisateur
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation([
            position.coords.latitude,
            position.coords.longitude
          ]);
          setLocationError(null);
        },
        (error) => {
          console.error("Erreur de géolocalisation:", error);
          setLocationError("Impossible de déterminer votre position. " + error.message);
          // Position par défaut: Paris
          setCurrentLocation([48.8566, 2.3522]);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      setLocationError("La géolocalisation n'est pas supportée par ce navigateur.");
      // Position par défaut: Paris
      setCurrentLocation([48.8566, 2.3522]);
    }
  };

  const getCommandes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/commandes");
      setCommandes(response.data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients");
      // Ajouter des positions simulées aux clients
      const clientsWithPositions = response.data.map((client: any) => ({
        ...client,
        position: [
          48.8566 + (Math.random() - 0.5) * 0.05,
          2.3522 + (Math.random() - 0.5) * 0.05
        ] as [number, number]
      }));
      setClients(clientsWithPositions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const getRestaurateurs = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/restaurateurs");
      // Ajouter des positions simulées aux restaurants
      const restaurateursWithPositions = response.data.map((resto: any) => ({
        ...resto,
        position: [
          48.8566 + (Math.random() - 0.5) * 0.05,
          2.3522 + (Math.random() - 0.5) * 0.05
        ] as [number, number]
      }));
      setRestaurateur(restaurateursWithPositions);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Générer les itinéraires entre restaurants et clients
  useEffect(() => {
    if (commandes.length > 0 && restaurateurs.length > 0 && clients.length > 0) {
      const newRoutes: IRoute[] = [];
      
      commandes.forEach(commande => {
        const restaurant = restaurateurs.find(r => r._id === commande.restaurant);
        const client = clients.find(c => c._id === commande.client);
        
        if (restaurant?.position && client?.position) {
          newRoutes.push({
            id: `${commande._id}-route`,
            from: restaurant.position,
            to: client.position,
            commandeId: commande._id
          });
        }
      });
      
      setRoutes(newRoutes);
    }
  }, [commandes, restaurateurs, clients]);

  // Initialiser la carte Leaflet
  useEffect(() => {
    // Si les restaurants sont chargés et le container existe
    if (mapRef.current && !mapInstanceRef.current) {
      // Centre de la carte (Paris par défaut)
      const defaultPosition: [number, number] = [48.8566, 2.3522];
      
      // Créer l'instance de la carte
      const map = L.map(mapRef.current).setView(defaultPosition, 12);
      mapInstanceRef.current = map;
      
      // Ajouter le fond de carte OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }
    
    // Nettoyer la carte lors du démontage du composant
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);
  
  // Mettre à jour la position actuelle sur la carte
  useEffect(() => {
    if (!mapInstanceRef.current || !currentLocation) return;
    
    const map = mapInstanceRef.current;
    
    // Supprimer l'ancien marqueur de position
    if (currentLocationMarkerRef.current) {
      currentLocationMarkerRef.current.remove();
    }
    
    // Ajouter le nouveau marqueur de position
    currentLocationMarkerRef.current = L.marker(currentLocation, { 
      icon: CurrentLocationIcon,
      zIndexOffset: 1000 // S'assurer qu'il est au-dessus des autres marqueurs
    }).addTo(map)
      .bindPopup("<b>Votre position</b>")
      .openPopup();
    
    // Centrer la carte sur la position actuelle
    map.setView(currentLocation, 13);
    
  }, [currentLocation]);
  
  // Mettre à jour les marqueurs et les chemins
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    const map = mapInstanceRef.current;
    
    // Supprimer les anciens chemins animés
    antPathsRef.current.forEach(path => path.remove());
    antPathsRef.current = [];
    
    // Nettoyer tous les calques existants (sauf le fond de carte)
    map.eachLayer(layer => {
      if (layer instanceof L.TileLayer) return; // Garder le fond de carte
      if (layer === currentLocationMarkerRef.current) return; // Garder le marqueur de position actuelle
      layer.remove();
    });
    
    // Ajouter les marqueurs des restaurants
    restaurateurs.forEach(resto => {
      if (resto.position) {
        const marker = L.marker(resto.position, { icon: RestaurantIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center">
              <b>${resto.restaurantName}</b><br>
              ${resto.address}<br>
              <span style="color: #666; font-size: 0.9em">${resto.phone}</span>
            </div>
          `);
      }
    });
    
    // Ajouter les marqueurs des clients
    clients.forEach(client => {
      if (client.position) {
        const marker = L.marker(client.position, { icon: ClientIcon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center">
              <b>${client.name}</b><br>
              ${client.address}<br>
              <span style="color: #666; font-size: 0.9em">${client.phone}</span>
            </div>
          `);
      }
    });
    
    // Ne montrer que les routes pour les commandes visibles
    const visibleRoutes = routes.filter(
      route => !hiddenCommandes.includes(route.commandeId)
    );
    
    // Ajouter les chemins animés
    visibleRoutes.forEach(route => {
      // Vérifier si c'est la route sélectionnée
      const isSelected = selectedCommande === route.commandeId;
      
      try {
        // @ts-ignore - Ignorer les erreurs TypeScript pour antPath
        const antPath = L.polyline.antPath([route.from, route.to], {
          delay: 800,
          dashArray: [10, 20],
          weight: isSelected ? 5 : 3,
          color: isSelected ? "#FF0000" : "#0000FF",
          pulseColor: "#FFFFFF",
          paused: false,
          reverse: false,
          hardwareAccelerated: true
        }).addTo(map);
        
        // Ajouter un événement de clic sur le chemin
        antPath.on('click', () => {
          handleSelectCommande(route.commandeId);
        });
        
        // Stocker la référence pour pouvoir le supprimer plus tard
        antPathsRef.current.push(antPath);
        
        // Si c'est la route sélectionnée, zoom dessus
        if (isSelected) {
          const bounds = L.latLngBounds([route.from, route.to]);
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Erreur lors de la création du chemin animé:", error);
      }
    });
    
  }, [restaurateurs, clients, routes, selectedCommande, hiddenCommandes]);
  
  // Fonction pour sélectionner une commande
  const handleSelectCommande = (commandeId: string) => {
    setSelectedCommande(commandeId === selectedCommande ? null : commandeId);
  };

  // Fonction pour masquer une commande
  const hideCommande = (commandeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenCommandes(prev => [...prev, commandeId]);
  };
  
  // Fonction pour réinitialiser la vue de la carte
  const resetMapView = () => {
    if (!mapInstanceRef.current || !currentLocation) return;
    mapInstanceRef.current.setView(currentLocation, 13);
  };
  
  // Filtrer les commandes pour n'afficher que celles qui ne sont pas masquées
  const visibleCommandes = commandes.filter(commande => !hiddenCommandes.includes(commande._id));
 
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center p-4">
      <div className="bg-purple-300 w-full max-w-md p-4 flex justify-between items-center rounded-t-xl">
        <h1 className="text-xl font-bold">CESIEAT Livreur</h1>
        <Link to={'/account'}>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">👤</div>
        </Link>
      </div>
      <div className="bg-white w-full max-w-md p-4 rounded-b-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Commandes à proximité</h2>
          <div className="flex space-x-2">
            <button 
              onClick={resetMapView}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              title="Centrer sur ma position"
            >
              <FaMapMarkerAlt className="text-lg" />
            </button>
            <button 
              onClick={loadAllData}
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
              title="Rafraîchir"
            >
              <FaRedoAlt className="text-lg" />
            </button>
          </div>
        </div>
        
        {locationError && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
            <p>{locationError}</p>
          </div>
        )}
        
        <div 
          ref={mapRef} 
          className="w-full mb-4 rounded-lg shadow-md"
          style={{ height: '300px' }}
        ></div>
        
        <div className="space-y-2 mt-4">
          {isLoading ? (
            <div className="text-center py-4 flex flex-col items-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500 mb-2"></div>
              <p>Chargement des commandes...</p>
            </div>
          ) : (
            <>
              {visibleCommandes.length > 0 ? (
                visibleCommandes.map((commande, index) => {
                  const restaurant = restaurateurs.find(r => r._id === commande.restaurant);
                  const client = clients.find(c => c._id === commande.client);
                  
                  return (
                    <div 
                      key={index} 
                      className={`${selectedCommande === commande._id ? 'bg-purple-300' : 'bg-purple-200'} 
                        flex justify-between items-center p-3 rounded-lg shadow cursor-pointer transition-colors`}
                      onClick={() => handleSelectCommande(commande._id)}
                    >
                      <div className="flex-1">
                        <p className="font-semibold">
                          {restaurant?.restaurantName || "Restaurant inconnu"} 
                          → {client?.name || "Client inconnu"} 
                        </p>
                        <p className="font-semibold text-xs">
                          {restaurant?.address || "Restaurant address inconnu"} 
                          → {client?.address || "Client address inconnu"} 
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm font-bold">
                            {commande.totalAmount}€
                          </p>
                          <span className="text-xs bg-gray-200 rounded px-2 py-1">
                            {commande.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Link 
                          to={`/livraison/${commande._id}`} 
                          className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 mr-2"
                        >
                          <FaWalking className="text-lg" />
                        </Link>
                        <button 
                          className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300"
                          onClick={(e) => hideCommande(commande._id, e)}
                          title="Masquer cette commande"
                        >
                          <FaTrash className="text-lg" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2 text-xl">🍽️</p>
                  <p>Aucune commande disponible pour le moment</p>
                  <button 
                    onClick={loadAllData}
                    className="mt-2 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 transition"
                  >
                    Rafraîchir les commandes
                  </button>
                </div>
              )}
              
              {hiddenCommandes.length > 0 && (
                <div className="text-center mt-4">
                  <button 
                    className="text-sm text-purple-600 underline"
                    onClick={() => setHiddenCommandes([])}
                  >
                    Afficher {hiddenCommandes}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
