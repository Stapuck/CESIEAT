import React, { useState } from "react";
import {
  FaHashtag,
  FaStore,
  FaUser,
  FaMapMarkerAlt,
  FaEyeSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";

interface CommandeItemProps {
  commande: {
    _id: string;
    status: string;
    totalAmount: number;
  };
  restaurant?: {
    restaurantName: string;
    address: string;
    url: string;
    position?: [number, number];
  };
  client?: {
    name: string;
    address: string;
  };
  currentLocation?: [number, number] | null;
  isSelected: boolean;
  onSelect: (commandeId: string) => void;
  onHide: (commandeId: string, e: React.MouseEvent) => void;
  onTake?: (commandeId: string) => Promise<void>;
}

const CommandeItem: React.FC<CommandeItemProps> = ({
  commande,
  restaurant,
  client,
  currentLocation,
  isSelected,
  onSelect,
  onHide,
  onTake,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour déterminer la classe CSS du statut
  const getStatusClass = (status: string) => {
    switch (status) {
      case "Préparation":
        return "bg-yellow-100 text-yellow-800";
      case "En Livraison":
        return "bg-blue-100 text-blue-800";
      case "Livré":
        return "bg-green-100 text-green-800";
      case "Prêt":
        return "bg-green-200 text-green-800";
      case "Annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-orange-100 text-black-800";
    }
  };

  // Fonction pour afficher le texte du statut
  const getStatusText = (status: string) => {
    switch (status) {
      case "Préparation":
        return "En préparation";
      case "En Livraison":
        return "En livraison";
      case "Livré":
        return "Livré";
      case "Prêt":
        return "Prêt";
      case "Annulée":
        return "Annulée";
      default:
        return "En attente";
    }
  };

  // Fonction pour formater l'ID de commande plus court et lisible
  const formatCommandeId = (id: string) => {
    // Prendre les 6 derniers caractères de l'ID
    return id.length > 6 ? id.substring(id.length - 6) : id;
  };

  // Calculer la distance entre deux points géographiques en km
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Rayon de la terre en km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Obtenir la distance formatée
  const getDistanceText = () => {
    if (!currentLocation || !restaurant?.position) return "Distance inconnue";

    const distance = calculateDistance(
      currentLocation[0],
      currentLocation[1],
      restaurant.position[0],
      restaurant.position[1]
    );

    return distance < 1
      ? `${Math.round(distance * 1000)} m`
      : `${distance.toFixed(1)} km`;
  };

  const statusClass = getStatusClass(commande.status);

  // Empêche la propagation du clic sur les boutons
  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêcher la sélection de la commande

    if (onTake) {
      setIsLoading(true);
      try {
        await onTake(commande._id);
        toast.success("Commande prise avec succès");
      } catch (error) {
        toast.error("Erreur lors de la prise de commande");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div
      className={`${
        isSelected ? "border-2 border-purple-500" : "border border-gray-200"
      } bg-white rounded-lg shadow-sm p-4 cursor-pointer transition-all hover:shadow-md relative`}
      onClick={() => onSelect(commande._id)}
    >
      {/* En-tête avec status et ID de commande */}
      <div className="flex justify-between items-center mb-3">
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${statusClass}`}
        >
          {getStatusText(commande.status)}
        </span>

        <div className="flex items-center text-gray-500 text-sm mr-6">
          <FaHashtag className="mr-1" />
          <span title={commande._id}>{formatCommandeId(commande._id)}</span>
        </div>
      </div>

      {/* Informations sur le restaurant */}
      <div className="mb-3">
        <div className="flex items-start">
          <FaStore className="text-gray-500 mt-1 mr-2" />
          <div>
            <h3 className="font-semibold text-gray-800">
              {restaurant?.restaurantName || "Restaurant inconnu"}
            </h3>
            <p className="text-sm text-gray-600 break-words">
              {restaurant?.address || "Adresse inconnue"}
            </p>
          </div>
        </div>
      </div>

      {/* Informations sur le client */}
      <div className="mb-3">
        <div className="flex items-start">
          <FaUser className="text-gray-500 mt-1 mr-2" />
          <div>
            <h3 className="font-semibold text-gray-800">
              {client?.name || "Client inconnu"}
            </h3>
            <p className="text-sm text-gray-600 break-words">
              {client?.address || "Adresse inconnue"}
            </p>
          </div>
        </div>
      </div>

      {/* Distance et boutons */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center text-sm font-medium text-blue-700">
          <FaMapMarkerAlt className="mr-1" />
          <span>{getDistanceText()}</span>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={(e) => onHide(commande._id, e)}
            className="p-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-700"
            title="Masquer cette commande"
          >
            <FaEyeSlash />
          </button>

          <button
            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center"
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="inline-block animate-spin mr-1">⌛</span>
            ) : null}
            Prendre cette commande
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandeItem;
