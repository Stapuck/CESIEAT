import React, { useState, useRef, useEffect } from "react";
import SearchIcon from "../assets/icons/magnifyingglass.svg";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import FoodIcon from "../assets/icons/fork.knife.circle.fill.svg";
import LocationPin from "../assets/icons/mappin.svg";
import LoadingArrow from "../assets/icons/arrow.trianglehead.2.clockwise.svg";
import LocateUserLogo from "../assets/icons/location.circle.fill.svg";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Icône personnalisée pour les restaurants
const customIcon = new L.Icon({
  iconUrl: FoodIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

// Icône pour la position actuelle
const locationIcon = new L.Icon({
  iconUrl: LocationPin,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface IRestaurant {
  _id: string;
  name: string;
  position: [number, number];
  ville: string;
  url_image: string;
}

const Search = () => {
  const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
  const [position, setPosition] = useState<[number, number]>([
    46.603354, 1.888334,
  ]); // Position par défaut : France
  const [filteredSuggestions, setFilteredSuggestions] = useState<IRestaurant[]>(
    []
  );
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(5);
  const searchQueryRef = useRef("");
  const navigate = useNavigate();

  // Fonction pour naviguer vers la page des menus du restaurant
  const goToRestaurantMenus = (id: string, name: string, url_image: string) => {
    if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
      // Utiliser un slug dans l'URL basé sur le nom du restaurant pour SEO
      const restaurantSlug = name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      navigate(`/client/restaurant/${restaurantSlug}`, {
        state: {
          restaurantId: id,
          restaurantName: name,
          restaurantImage: url_image,
        },
      });
    } else {
      console.error("ID de restaurant invalide:", id);
      toast.error(
        "ID de restaurant invalide. Impossible de naviguer vers les menus."
      );
    }
  };

  // Dans la fonction getRestaurants, filtrer les restaurants avec des coordonnées valides
  const getRestaurants = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://cesieat.nathan-lorit.com/api/restaurateurs"
      );

      // Filtrer pour n'inclure que les restaurants avec des positions valides
      const validRestaurants = response.data
        .filter((restaurant: any) => {
          return (
            restaurant.position &&
            Array.isArray(restaurant.position) &&
            restaurant.position.length === 2 &&
            typeof restaurant.position[0] === "number" &&
            typeof restaurant.position[1] === "number" &&
            !isNaN(restaurant.position[0]) &&
            !isNaN(restaurant.position[1])
          );
        })
        .map((restaurant: any) => ({
          _id: restaurant._id,
          name: restaurant.restaurantName,
          position: restaurant.position as [number, number],
          ville: restaurant.address,
          url_image: restaurant.url_image || "", // Ajouter une valeur par défaut pour url
        }));

      setRestaurants(validRestaurants);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des restaurants :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  // Gérer la recherche
  const handleSearch = async () => {
    const query = searchQueryRef.current.trim();
    if (!query) return;
    setLoading(true);
    setZoom(13);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setPosition([parseFloat(lat), parseFloat(lon)]);
      } else {
        toast.error("Aucun résultat trouvé pour cette ville.");
      }
    } catch (error) {
      toast.error("Erreur lors de la recherche.");
    } finally {
      setLoading(false);
    }
  };

  // Gérer les suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchQueryRef.current = e.target.value.trim();
    const query = searchQueryRef.current.toLowerCase();
    if (query) {
      const suggestions = restaurants.filter(
        (restaurant) =>
          restaurant.name.toLowerCase().includes(query) ||
          restaurant.ville.toLowerCase().includes(query)
      );
      setFilteredSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (point: IRestaurant) => {
    searchQueryRef.current = point.name;
    setPosition(point.position);
    setZoom(13);
    setShowSuggestions(false);
  };

  const RecenterMap = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    map.setView(position, zoom);
    return null;
  };

  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setZoom(13);
          toast.success("Position actuelle trouvée !");
        },
        (error) => {
          console.error("Erreur lors de la récupération de la position :", error);
          toast.error("Impossible de récupérer votre position.");
        }
      );
    } else {
      toast.error("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  return (
    <div className="flex flex-col items-center relative z-10 bg-primary py-8 px-4 sm:px-8">
      <p className="text-black font-bold text-center pb-4 text-lg sm:text-xl md:text-2xl">
        Rapide et proche de chez vous
      </p>
      <div className="relative w-full max-w-[670px]">
        <input
          type="text"
          onChange={handleInputChange}
          className="input shadow-xl input-bordered text-text-search-color bg-white rounded-full font-bold p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Votre ville ou restaurant"
          aria-label="Champ de recherche"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-button-background p-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Rechercher"
        >
          {loading ? (
            <img src={LoadingArrow} alt="Loading..." className="w-5 h-5" />
          ) : (
            <img src={SearchIcon} alt="Search" className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={locateUser}
          className="absolute top-1/2 right-12 transform -translate-y-1/2 bg-green-500 p-2 mr-2 rounded-full hover:cursor-pointer hover:scale-110 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Localiser"
        >
          <img src={LocateUserLogo} alt="Localiser" className="w-5 h-5" />
        </button>
        {showSuggestions && (
          <ul className="absolute bg-white border border-gray-300 rounded-lg shadow-lg mt-2 w-full max-h-40 overflow-y-auto z-50">
            {filteredSuggestions.map((point) => (
              <li
                key={point._id}
                onClick={() => handleSuggestionClick(point)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
              >
                {point.name} - {point.ville}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full h-[400px] mt-8 px-3 z-1 max-w-[1200px]">
        <MapContainer
          center={position}
          zoom={zoom}
          scrollWheelZoom={true}
          className="h-full w-full rounded-lg shadow-lg border border-gray-300"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <RecenterMap position={position} />

          {/* Marqueur pour la position actuelle */}
          <Marker position={position} icon={locationIcon}>
            <Popup>Position actuelle : {searchQueryRef.current}</Popup>
          </Marker>

          {/* Marqueurs pour tous les restaurants avec vérification de position valide */}
          {restaurants.map((restaurant) => {
            // Vérification supplémentaire avant de créer un marqueur
            if (
              !restaurant.position ||
              !Array.isArray(restaurant.position) ||
              restaurant.position.length !== 2 ||
              typeof restaurant.position[0] !== "number" ||
              typeof restaurant.position[1] !== "number" ||
              isNaN(restaurant.position[0]) ||
              isNaN(restaurant.position[1])
            ) {
              return null;
            }

            return (
              <Marker
                key={restaurant._id}
                position={restaurant.position}
                icon={customIcon}
              >
                <Popup>
                  <div
                    className="flex flex-col items-center justify-center overflow-clip rounded-lg bg-cover bg-center h-32 w-78"
                    style={{ backgroundImage: `url(${restaurant.url_image})` }}
                  ></div>
                  <p className="my-0">{restaurant.name}</p>

                  <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors hover:cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      goToRestaurantMenus(
                        restaurant._id,
                        restaurant.name,
                        restaurant.url_image
                      );
                    }}
                  >
                    Voir les menus
                  </button>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default Search;
