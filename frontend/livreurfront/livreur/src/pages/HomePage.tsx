import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { FaQrcode, FaHashtag, FaStore, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// Importer leaflet-ant-path après Leaflet
import "leaflet-ant-path";

// Correction pour les icônes Leaflet
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import Refresh from "../assets/icons/arrow.trianglehead.2.clockwise.svg";
import CommandeItem from "../components/CommandeItem";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";
// Ajouter ces imports
import Swal from "sweetalert2";
import QRScanner from "../components/QRScanner";
// Modifier l'import pour avoir accès à la fois aux anciennes et nouvelles API
import * as ReactDOM from "react-dom/client";
// Importer également le ReactDOM classique pour les méthodes render et unmountComponentAtNode

// Configuration de l'icône par défaut pour Leaflet

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
  clientId_Zitadel: string;
  restaurantId: string;
  menuId: string;
  totalAmount: number;
  status: string;
}

interface IClient {
  name: string;
  email: string;
  phone: string;
  address: string;
  isPaused: boolean;
  clientId_Zitadel: string;
}

interface IRestaurateur {
  _id: string;
  position: [number, number];
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  url_image: string;
  managerId_Zitadel: string;
}

interface ILivreurs {
  name: string;
  email: string;
  phone: string;
  address: string;
  vehiculeType: string;
  codeLivreur: string;
  livreurId_Zitadel: string;
  isAvailable: boolean;
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [myCommandes, setMyCommandes] = useState<ICommande[]>([]); // Commandes prises par ce livreur
  const [clients, setClients] = useState<IClient[]>([]);
  const [restaurateurs, setRestaurateur] = useState<IRestaurateur[]>([]);
  const [livreurs, setLivreurs] = useState<ILivreurs[]>([]); // Liste des livreurs
  const auth = useAuth();

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

    // Charger également les commandes déjà prises par ce livreur
    if (auth.user?.profile.sub) {
      loadMyOrders();
    }
  }, [auth.user?.profile.sub]);

  // Fonction pour charger toutes les données
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        getCommandes(),
        getClients(),
        getRestaurateurs(),
        getLivreus(),
      ]);

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
          cmd.status === "Préparation" ||
          cmd.status === "Prêt" ||
          cmd.status === "En attente"
      );
      setCommandes(filteredCommandes);
    } catch (error) {
      console.error("Erreur lors de la récupération des commandes:", error);
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/clients");
      setClients(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des clients:", error);
    }
  };

  const getRestaurateurs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/restaurateurs"
      );

      setRestaurateur(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurateurs:", error);
    }
  };

  const getLivreus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/livreurs");
      setLivreurs(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des livreurs:", error);
    }
  };

  // Fonction pour charger les commandes prises par ce livreur
  const loadMyOrders = async () => {
    if (!auth.user?.profile.sub) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/commandes/livreur/${auth.user.profile.sub}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyCommandes(data);
      }
    } catch (error) {
      console.error(
        "Erreur lors du chargement des commandes du livreur:",
        error
      );
    }
  };

  // Fonction pour prendre une commande
  const handleTakeCommande = async (commandeId: string) => {
    if (!auth.user?.profile.sub) {
      toast.error("Vous devez être connecté pour prendre une commande.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/commandes/${commandeId}/${auth.user.profile.sub}/assign`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.user.access_token}`,
          },
          body: JSON.stringify({
            livreurId_Zitadel: auth.user.profile.sub,
            status: "En livraison",
          }),
        }
      );

      if (response.ok) {
        // Rafraîchir les données
        loadAllData();
        loadMyOrders();

        // Notification de succès
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
      toast.error(
        "Une erreur est survenue lors de la prise de cette commande."
      );
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

  // Mettre à jour les marqueurs et routes lorsque les données changent ou qu'une commande est sélectionnée
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
        zIndexOffset: 1000, // S'assure que ce marqueur est toujours au-dessus des autres
      })
        .addTo(map)
        .bindPopup("<b>Votre position actuelle</b>");

      // Recentrer la carte sur la position actuelle seulement au premier chargement
      // ou lors d'une mise à jour explicite via le bouton
      if (!mapInstanceRef.current.userInitialView && !selectedCommande) {
        map.setView(currentLocation, 14); // Zoom un peu plus proche
        mapInstanceRef.current.userInitialView = true;
      }
    }

    // Ajouter les marqueurs des restaurants
    if (restaurateurs?.length > 0 && commandes?.length > 0) {
      // Filtre les restaurants qui ont des commandes associées
      const restaurantsWithOrders = restaurateurs.filter((resto) =>
        commandes.some((cmd) => cmd.restaurantId === resto._id)
      );

      // Pour stocker les limites de la carte (quels restaurants afficher)
      const bounds = currentLocation
        ? L.latLngBounds([currentLocation])
        : L.latLngBounds();
      let selectedRestaurant = null;

      restaurateurs.forEach((resto) => {
        if (
          resto.position &&
          Array.isArray(resto.position) &&
          resto.position.length === 2
        ) {
          // Vérifier si ce restaurant est associé à la commande sélectionnée
          const isSelectedRestaurant =
            selectedCommande &&
            commandes.some(
              (cmd) =>
                cmd._id === selectedCommande && cmd.restaurantId === resto._id
            );

          if (isSelectedRestaurant) {
            selectedRestaurant = resto;
          }

          // Toujours afficher tous les restaurants sur la carte
          const marker = L.marker(resto.position as [number, number], {
            icon: RestaurantIcon,
            // Mettre en évidence le restaurant sélectionné avec un zIndex plus élevé
            zIndexOffset: isSelectedRestaurant ? 500 : 0,
          }).addTo(map).bindPopup(`
            <div>
              <h3 style="font-weight: bold; font-size: 16px;">${resto.restaurantName}</h3>
              <p>${resto.address}</p>
              <p style="margin-top: 5px;"><b>Tél:</b> ${resto.phone}</p>
            </div>
          `);

          // Si ce restaurant est sélectionné, ouvrir automatiquement le popup
          if (isSelectedRestaurant) {
            marker.openPopup();
          }

          // N'ajouter à la délimitation que si aucune commande n'est sélectionnée
          // ou si c'est le restaurant de la commande sélectionnée
          if (!selectedCommande || isSelectedRestaurant) {
            bounds.extend(resto.position);
          }
        }
      });

      // Tracer un chemin UNIQUEMENT pour le restaurant sélectionné
      if (currentLocation && selectedCommande && selectedRestaurant) {
        // Fetch route from current location to selected restaurant
        fetch(
          `https://routing.openstreetmap.de/routed-car/route/v1/driving/${currentLocation[1]},${currentLocation[0]};${selectedRestaurant.position[1]},${selectedRestaurant.position[0]}?overview=full&geometries=geojson`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data.routes && data.routes.length > 0) {
              // Extract the coordinates from the route
              const routeCoordinates = data.routes[0].geometry.coordinates.map(
                (coord: [number, number]) => [coord[1], coord[0]] // Convert [lng, lat] to [lat, lng] for Leaflet
              );

              // Create the animated path with the actual route
              const antPath = (L as any).polyline
                .antPath(routeCoordinates, {
                  delay: 800,
                  dashArray: [10, 20],
                  weight: 5, // Un peu plus épais pour être plus visible
                  color: "#0275d8",
                  pulseColor: "#2A93EE",
                  paused: false,
                  reverse: false,
                  hardwareAccelerated: true,
                })
                .addTo(map);

              antPathsRef.current.push(antPath);

              // Ajuster la vue pour montrer tout l'itinéraire
              const routeBounds = L.latLngBounds(routeCoordinates);
              map.fitBounds(routeBounds, { padding: [50, 50] });
            }
          })
          .catch((error) => {
            console.error("Error fetching route:", error);

            // Fallback to direct line if route fetching fails
            const antPath = (L as any).polyline
              .antPath([currentLocation, selectedRestaurant.position], {
                delay: 800,
                dashArray: [10, 20],
                weight: 5,
                color: "#0275d8",
                pulseColor: "#2A93EE",
                paused: false,
                reverse: false,
                hardwareAccelerated: true,
              })
              .addTo(map);

            antPathsRef.current.push(antPath);

            // Ajuster la vue pour montrer le trajet direct
            map.fitBounds([currentLocation, selectedRestaurant.position], {
              padding: [50, 50],
            });
          });
      }
      // Si aucune commande n'est sélectionnée, ajuster la vue pour montrer tous les restaurants
      else if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [currentLocation, restaurateurs, commandes, selectedCommande]);

  // Fonction pour gérer la sélection d'une commande
  const handleSelectCommande = (commandeId: string) => {
    // Si on clique sur la commande déjà sélectionnée, la désélectionner
    if (selectedCommande === commandeId) {
      setSelectedCommande(null);
    } else {
      setSelectedCommande(commandeId);
    }
  };

  // Rafraîchir la position actuelle
  const refreshCurrentLocation = () => {
    getCurrentLocation();
    // Reset le flag pour permettre le recentrage automatique
    if (mapInstanceRef.current) {
      mapInstanceRef.current.userInitialView = false;
    }
  };

  // Fonction pour ouvrir la modal de scan QR
  const handleOpenQRScanner = () => {
    let root = null; // Pour stocker la référence au root React

    Swal.fire({
      title: "Scanner un QR Code",
      html: '<div id="swal-qr-container"></div>',
      showConfirmButton: false,
      showCloseButton: true,
      width: "auto",
      didOpen: () => {
        // Monter le composant QRScanner dans le conteneur SweetAlert
        const container = document.getElementById("swal-qr-container");
        if (container) {
          // Créer un élément div pour le QRScanner
          const qrElement = document.createElement("div");
          container.appendChild(qrElement);

          // Utiliser l'API ReactDOM moderne avec createRoot
          root = ReactDOM.createRoot(qrElement);
          root.render(
            <QRScanner
              onScan={(data) => {
                handleQRScan(data);
                Swal.close();
              }}
              onClose={() => {
                Swal.close();
              }}
              onError={(error) => {
                toast.error(`Erreur de scan: ${error}`);
              }}
            />
          );
        }
      },
      willClose: () => {
        // Nettoyer le composant QRScanner lors de la fermeture
        if (root) {
          root.unmount();
        }
      },
    });
  };

  // Fonction pour gérer le code QR scanné
  const handleQRScan = async (commandeId: string) => {
    try {
      // Vérifier si l'ID est valide
      if (!commandeId) {
        toast.error("QR code invalide ou non reconnu");
        return;
      }

      await axios.put(`http://localhost:8080/api/commandes/${commandeId}`, {
        status: "Livrée",
      });
      toast.success("Commande marquée comme livrée avec succès!");

      // Rediriger vers la page de détails de la commande ou effectuer une action
      // Exemple: navigate(`/livreur/commande/${commandeId}`);
    } catch (error) {
      console.error("Erreur lors du traitement du QR code:", error);
      toast.error("Erreur lors du traitement du code QR");
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="bg-secondary flex justify-between w-full p-4 my-3 items-center rounded-xl">
        <h1 className="text-xl font-bold">Livraisons disponibles</h1>
      </div>

      <div className="w-full pt-4 rounded-b-xl">
        {/* Carte interactive */}
        <div className="relative mb-4 flex flex-col items-center"></div>
        <div
          ref={mapRef}
          className="w-full h-64 rounded-lg shadow-inner border shadow-md border-gray-200"
          style={{ height: "300px" }}
        ></div>

        {/* Bouton pour rafraîchir la position */}
        <button
          onClick={refreshCurrentLocation}
          className="flex items-center justify-between right-2 bg-white mt-2 p-2 px-4 rounded-2xl shadow-md hover:bg-gray-100"
          title="Actualiser ma position"
        >
          Actualiser ma position
          <img src={Refresh} alt="Refresh" className="ml-3 w-5 h-5" />
        </button>

        {/* Message d'erreur de localisation */}
        {locationError && (
          <div className="mt-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {locationError}
          </div>
        )}
      </div>

      {/* Commandes que j'ai prises */}
      {myCommandes.length > 0 && (
        <div className="w-full mt-8 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-green-700 flex items-center">
            <span className="mr-2">🚚</span> Mes livraisons en cours{" "}
            <span className="text-black bg-white rounded-md shadow-lg px-2 py-1 ml-4">
              {" "+livreurs.find(
                (l) => l.livreurId_Zitadel === auth.user?.profile.sub
              )?.codeLivreur}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCommandes.map((commande) => {
              const restaurant = restaurateurs.find(
                (r) => r._id === commande.restaurantId
              );
              const client = clients.find(
                (c) => c.clientId_Zitadel === commande.clientId_Zitadel
              );

              return (
                <Link
                  to={`/livreur/`}
                  key={commande._id}
                  className="bg-green-50 border border-green-200 rounded-lg shadow-sm p-4 hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                      En livraison
                    </span>

                    <div className="flex items-center text-gray-500 text-sm">
                      <FaHashtag className="mr-1" />
                      <span>
                        {commande._id.substring(commande._id.length - 6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start mb-3">
                    <FaStore className="text-gray-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {restaurant?.restaurantName || "Restaurant inconnu"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaUser className="text-gray-500 mt-1 mr-2" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {client?.name || "Client inconnu"}
                      </h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <button
            onClick={handleOpenQRScanner}
            className="flex justify-center items-center bg-blue-500 text-white px-3 my-2 py-2 rounded-lg hover:bg-blue-600 w-auto"
          >
            <FaQrcode className="text-lg mr-2" />
            <span>Scanner</span>
          </button>
        </div>
      )}

      {/* Liste des commandes disponibles */}
      <div className="w-full mt-6">
        <h2 className="text-xl font-semibold mb-4">Commandes à livrer</h2>

        {isLoading ? (
          <div className="text-center py-4">Chargement des commandes...</div>
        ) : commandes.length === 0 ? (
          <div className="text-center py-4 bg-gray-50 rounded-lg shadow-sm">
            Aucune commande disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commandes
              .filter((cmd) => !hiddenCommandes.includes(cmd._id))
              .map((commande) => {
                const restaurant = restaurateurs.find(
                  (r) => r._id === commande.restaurantId
                );
                const client = clients.find(
                  (c) => c.clientId_Zitadel === commande.clientId_Zitadel
                );

                return (
                  <CommandeItem
                    key={commande._id}
                    commande={commande}
                    restaurant={
                      restaurant
                        ? {
                            restaurantName: restaurant.restaurantName,
                            address: restaurant.address,
                            url: restaurant.url_image || "",
                            position: restaurant.position,
                          }
                        : undefined
                    }
                    client={
                      client
                        ? {
                            name: client.name,
                            address: client.address,
                          }
                        : undefined
                    }
                    currentLocation={currentLocation}
                    isSelected={selectedCommande === commande._id}
                    onSelect={handleSelectCommande}
                    onHide={(id, e) => {
                      e.stopPropagation();
                      setHiddenCommandes([...hiddenCommandes, id]);
                    }}
                    onTake={handleTakeCommande}
                  />
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
