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
import BikeLogo from "../assets/icons/bicycle.circle.fill.svg";
import { useLogger } from "../hooks/useLogger";
// Configuration de l'icône par défaut pour Leaflet

const logger = useLogger();

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

// Icône pour le livreur
const DeliveryIcon = L.icon({
  iconUrl: BikeLogo,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface ICommande {
  _id: string;
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

  // Ajout d'un état pour gérer le recentrage initial de la carte
  const [hasUserInitialView, setHasUserInitialView] = useState(false);

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
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors du chargement des données: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      setIsLoading(false);
    }
  };

  // Récupérer les commandes disponibles (seulement Préparation et Prêt)
  const getCommandes = async () => {
    try {
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/commandes");
      // Filtrer pour n'inclure que les statuts "Préparation" et "Prêt"
      const filteredCommandes = response.data.filter(
        (cmd: ICommande) =>
          cmd.status === "Préparation" ||
          cmd.status === "Prêt" ||
          cmd.status === "En attente"
      );
      setCommandes(filteredCommandes);
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la récupération des commandes: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
    }
  };

  const getClients = async () => {
    try {
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/clients");
      setClients(response.data);
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la récupération des clients: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
    }
  };

  const getRestaurateurs = async () => {
    try {
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/restaurateurs");

      setRestaurateur(response.data);
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la récupération des restaurateurs: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
    }
  };

  const getLivreus = async () => {
    try {
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/livreurs");
      setLivreurs(response.data);
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la récupération des livreurs: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
    }
  };

  // Fonction pour charger les commandes prises par ce livreur
  const loadMyOrders = async () => {
    if (!auth.user?.profile.sub) return;

    try {
      const response = await fetch(
        `https://cesieat.nathan-lorit.com/api/commandes/livreur/${auth.user.profile.sub}`
      );
      if (response.ok) {
        const data = await response.json();
        setMyCommandes(data);
      }
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors du chargement des commandes du livreur: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
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
        `https://cesieat.nathan-lorit.com/api/commandes/${commandeId}/${auth.user.profile.sub}/assign`,
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
        toast.success("Commande prise avec succès.");
      } else {
        await response.json();
      }
    } catch (error: any) {
      toast.error(
        "Une erreur est survenue lors de la prise de cette commande."
      );
      logger({
        type: "error",
        message: `Erreur lors de la prise de commande: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
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
        (error: any) => {
          logger({
            type: "error",
            message: `Erreur de géolocalisation: ${error.message}`,
            clientId_Zitadel: auth.user?.profile?.sub || "unknown",
          });
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

      // Correction de la vérification et de la mise à jour de `userInitialView`
      if (!hasUserInitialView && !selectedCommande) {
        map.setView(currentLocation, 14); // Zoom un peu plus proche
        setHasUserInitialView(true); // Marquer comme recentré
      }
    }

    // Ajouter les marqueurs des restaurants et tracer les itinéraires
    if (restaurateurs?.length > 0 && commandes?.length > 0) {
      // Correction de l'appel à `L.latLngBounds` pour éviter les erreurs de type
      const bounds = currentLocation
        ? L.latLngBounds([currentLocation]) // Utilisation correcte de `currentLocation`
        : L.latLngBounds([[48.8566, 2.3522]]); // Valeur par défaut (Paris)

      restaurateurs.forEach((resto) => {
        if (
          resto.position &&
          Array.isArray(resto.position) &&
          resto.position.length === 2
        ) {
          L.marker(resto.position as [number, number], {
            icon: RestaurantIcon,
          }).addTo(map).bindPopup(`
            <div>
              <h3 style="font-weight: bold; font-size: 16px;">${resto.restaurantName}</h3>
              <p>${resto.address}</p>
              <p style="margin-top: 5px;"><b>Tél:</b> ${resto.phone}</p>
            </div>
          `);

          bounds.extend(resto.position);
        }
      });

      // Tracer un itinéraire complet si une commande est sélectionnée
      if (currentLocation && selectedCommande) {
        const selectedOrder = commandes.find(
          (cmd) => cmd._id === selectedCommande
        );
        const selectedRestaurant = restaurateurs.find(
          (resto) => resto._id === selectedOrder?.restaurantId
        );
        const selectedClient = clients.find(
          (client) =>
            client.clientId_Zitadel === selectedOrder?.clientId_Zitadel
        );

        if (selectedRestaurant && selectedClient) {
          // Valider les coordonnées avant de construire l'URL
          const isValidCoordinate = (coord: [number, number]) =>
            Array.isArray(coord) &&
            coord.length === 2 &&
            typeof coord[0] === "number" &&
            typeof coord[1] === "number";

          if (
            isValidCoordinate(currentLocation) &&
            isValidCoordinate(selectedRestaurant.position)
          ) {
            // Convertir l'adresse du client en coordonnées si nécessaire
            const getClientCoordinates = async () => {
              if (isValidCoordinate(selectedClient.address as any)) {
                return selectedClient.address as unknown as [number, number];
              } else {
                return await geocodeAddress(selectedClient.address);
              }
            };

            getClientCoordinates().then((clientCoordinates) => {
              if (clientCoordinates) {
                const routeUrl = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${currentLocation[1]},${currentLocation[0]};${selectedRestaurant.position[1]},${selectedRestaurant.position[0]};${clientCoordinates[1]},${clientCoordinates[0]}`;

                fetch(`${routeUrl}?overview=full&geometries=geojson`)
                  .then((response) => {
                    if (!response.ok) {
                      throw new Error(`Erreur API: ${response.status}`);
                    }
                    return response.json();
                  })
                  .then((data) => {
                    if (data.routes && data.routes.length > 0) {
                      const route = data.routes[0];
                      const routeCoordinates = route.geometry.coordinates.map(
                        (coord: [number, number]) => [coord[1], coord[0]]
                      );

                      // Ajouter le chemin animé
                      const antPath = (L as any).polyline
                        .antPath(routeCoordinates, {
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

                      // Ajouter un marqueur pour le client
                      L.marker(clientCoordinates, {
                        icon: ClientIcon,
                      })
                        .addTo(map)
                        .bindPopup(
                          `<b>${selectedClient.name}</b><br>${selectedClient.address}`
                        );

                      // Ajouter un marqueur animé qui suit le chemin
                      const animatedMarker = L.marker(routeCoordinates[0], {
                        icon: DeliveryIcon,
                      }).addTo(map);

                      let index = 0;
                      const interval = setInterval(() => {
                        if (index < routeCoordinates.length) {
                          animatedMarker.setLatLng(routeCoordinates[index]);
                          index++;
                        } else {
                          clearInterval(interval);
                        }
                      }, 10); // Ajuster la vitesse en modifiant l'intervalle (en millisecondes)

                      const routeBounds = L.latLngBounds(routeCoordinates);
                      map.fitBounds(routeBounds, { padding: [50, 50] });

                      // Afficher un toast avec la distance totale
                      const distanceInKm = (route.distance / 1000).toFixed(2); // Convertir en kilomètres
                      toast.info(
                        `Distance totale de l'itinéraire : ${distanceInKm} km`
                      );
                    }
                  })
                  .catch((error: any) => {
                    logger({
                      type: "error",
                      message: `Erreur lors de la récupération de l'itinéraire: ${error.message}`,
                      clientId_Zitadel: auth.user?.profile?.sub || "unknown",
                    });
                    toast.error(
                      "Impossible de récupérer l'itinéraire. Veuillez réessayer."
                    );
                  });
              } else {
                logger({
                  type: "error",
                  message: "Adresse du client invalide.",
                  clientId_Zitadel: auth.user?.profile?.sub || "unknown",
                });
                toast.error("Adresse du client invalide.");
              }
            });
          } else {
            logger({
              type: "error",
              message: "Coordonnées invalides pour le routage.",
              clientId_Zitadel: auth.user?.profile?.sub || "unknown",
            });
            toast.error("Coordonnées invalides pour le routage.");
          }
        }
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

  useEffect(() => {
    loadMyOrders();
  }, [myCommandes]);

  // Rafraîchir la position actuelle
  const refreshCurrentLocation = () => {
    getCurrentLocation();
    // Réinitialiser l'état pour permettre un nouveau recentrage
    setHasUserInitialView(false);
  };

  // Fonction pour ouvrir la modal de scan QR
  const handleOpenQRScanner = () => {
    let root: any; // Pour stocker la référence au root React

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

      await axios.put(`https://cesieat.nathan-lorit.com/api/commandes/${commandeId}`, {
        status: "Livrée",
      });
      toast.success("Commande marquée comme livrée avec succès!");

      // Rediriger vers la page de détails de la commande ou effectuer une action
      // Exemple: navigate(`/livreur/commande/${commandeId}`);
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors du traitement du QR code: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      toast.error("Erreur lors du traitement du code QR");
    }
  };

  // Ajoutez cette fonction dans votre composant HomePage

  // Fonction pour créer/mettre à jour un livreur dans la base de données
  const createOrUpdateLivreur = async () => {
    try {
      if (
        !auth.user?.profile.given_name ||
        !auth.user?.profile.family_name ||
        !auth.user?.profile.email ||
        !auth.user?.profile.sub
      ) {
        logger({
          type: "error",
          message: "Données utilisateur manquantes",
          clientId_Zitadel: auth.user?.profile?.sub || "unknown",
        });
        return;
      }

      const zitadelId = auth.user.profile.sub;

      // Données du livreur à créer/mettre à jour
      const livreurData = {
        name:
          auth.user.profile.given_name + " " + auth.user.profile.family_name,
        email: auth.user.profile.email,
        phone: "À renseigner", // Valeur par défaut
        address: "À renseigner", // Valeur par défaut
        vehicleType: "Vélo", // Valeur par défaut (corrigé: vehicleType au lieu de vehiculeType)
        livreurId_Zitadel: zitadelId,
        isAvailable: true,
      };

      // Vérifier d'abord si le livreur existe
      try {
        const checkResponse = await axios.get(
          `https://cesieat.nathan-lorit.com/api/livreurs/byZitadelId/${zitadelId}`,
          {
            headers: {
              Accept: "application/json",
            },
          }
        );

        // Le livreur existe, on récupère ses données actuelles

        // Mettre à jour le livreur (en conservant certaines données existantes)
        const updatedData = {
          ...livreurData,
          phone: checkResponse.data.phone || livreurData.phone,
          address: checkResponse.data.address || livreurData.address,
          vehicleType:
            checkResponse.data.vehicleType || livreurData.vehicleType, // Corriger ici aussi

          isAvailable:
            checkResponse.data.isAvailable !== undefined
              ? checkResponse.data.isAvailable
              : livreurData.isAvailable,
        };

        await axios.put(
          `https://cesieat.nathan-lorit.com/api/livreurs/byZitadelId/${zitadelId}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        );
      } catch (checkError: any) {
        // Si le livreur n'existe pas (erreur 404), on le crée
        if (checkError.response && checkError.response.status === 404) {

          await axios.post(`https://cesieat.nathan-lorit.com/api/livreurs`, livreurData, {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          });
        } else {
          // Une autre erreur s'est produite lors de la vérification
          throw checkError;
        }
      }
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la création/mise à jour du livreur: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
    }
  };

  // Ajoutez cet useEffect pour appeler la fonction au chargement
  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      createOrUpdateLivreur();
    }
  }, [auth.isAuthenticated, auth.user]);

  // Fonction pour convertir une adresse en coordonnées
  const geocodeAddress = async (
    address: string
  ): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error: any) {
      logger({
        type: "error",
        message: `Erreur lors de la géocodage de l'adresse: ${error.message}`,
        clientId_Zitadel: auth.user?.profile?.sub || "unknown",
      });
      return null;
    }
  };

  // Fonction pour masquer ou réafficher une commande
  const toggleHideCommande = (commandeId: string) => {
    if (hiddenCommandes.includes(commandeId)) {
      // Si la commande est déjà masquée, la réafficher
      setHiddenCommandes(hiddenCommandes.filter((id) => id !== commandeId));
    } else {
      // Sinon, la masquer
      setHiddenCommandes([...hiddenCommandes, commandeId]);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-primary min-h-screen">
      <div className="bg-tertiary flex justify-between w-full p-6 my-4 items-center rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800">
          Livraisons disponibles
        </h1>
      </div>

      <div className="w-full pt-6 rounded-b-xl">
        {/* Carte interactive */}
        <div className="relative mb-6 flex flex-col items-center"></div>
        <div
          ref={mapRef}
          className="w-full h-72 z-1 rounded-lg shadow-lg border border-gray-300"
          style={{ height: "350px" }}
        ></div>

        {/* Bouton pour rafraîchir la position */}
        <button
          onClick={refreshCurrentLocation}
          className="flex items-center justify-between bg-blue-500 text-white mt-4 p-3 px-5 rounded-full shadow-md hover:bg-blue-600 transition-all"
          title="Actualiser ma position"
        >
          Actualiser ma position
          <img src={Refresh} alt="Refresh" className="ml-3 w-5 h-5" />
        </button>

        {/* Message d'erreur de localisation */}
        {locationError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm shadow-sm">
            {locationError}
          </div>
        )}
      </div>

      {/* Commandes que j'ai prises */}
      {myCommandes.length > 0 && (
        <div className="w-full mt-10 mb-8">
          <h2 className="text-2xl font-semibold mb-6 text-green-700 flex items-center">
            <span className="mr-3">🚚</span> Mes livraisons en cours{" "}
            <span className="text-black bg-white rounded-md shadow-lg px-3 py-1 ml-4">
              {" " +
                livreurs.find(
                  (l) => l.livreurId_Zitadel === auth.user?.profile.sub
                )?.codeLivreur}
            </span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  className="bg-green-50 border border-green-200 rounded-lg shadow-md p-5 hover:shadow-lg transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium px-4 py-2 rounded-full bg-blue-100 text-blue-800">
                      En livraison
                    </span>

                    <div className="flex items-center text-gray-500 text-sm">
                      <FaHashtag className="mr-2" />
                      <span>
                        {commande._id.substring(commande._id.length - 6)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start mb-4">
                    <FaStore className="text-gray-500 mt-1 mr-3" />
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {restaurant?.restaurantName || "Restaurant inconnu"}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <FaUser className="text-gray-500 mt-1 mr-3" />
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
            className="flex justify-center items-center bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 shadow-md mt-6"
          >
            <FaQrcode className="text-lg mr-3" />
            <span>Scanner</span>
          </button>
        </div>
      )}

      {/* Liste des commandes disponibles */}
      <div className="w-full mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Commandes à livrer
        </h2>

        {isLoading ? (
          <div className="text-center py-6 text-gray-600">
            Chargement des commandes...
          </div>
        ) : commandes.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg shadow-md text-gray-600">
            Aucune commande disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {commandes
              .filter((commande) => !hiddenCommandes.includes(commande._id)) // Filtrer les commandes masquées
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
                      toggleHideCommande(id);
                    }}
                    onTake={handleTakeCommande} // Utilisation correcte de `onTake`
                  />
                );
              })}
          </div>
        )}

        {/* Bouton pour réafficher toutes les commandes masquées */}
        {hiddenCommandes.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setHiddenCommandes([])} // Réinitialiser les commandes masquées
              className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600"
            >
              Réafficher toutes les commandes masquées
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
