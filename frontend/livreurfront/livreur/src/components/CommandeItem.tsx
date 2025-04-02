import React from "react";
import { Link } from "react-router-dom";
import { FaWalking, FaTrash } from "react-icons/fa";
import CompteLogo from "../assets/icons/person.crop.circle.svg";

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
  };
  client?: {
    name: string;
    address: string;
  };
  isSelected: boolean;
  onSelect: (commandeId: string) => void;
  onHide: (commandeId: string, e: React.MouseEvent) => void;
}

const CommandeItem: React.FC<CommandeItemProps> = ({
  commande,
  restaurant,
  client,
  isSelected,
  onSelect,
  onHide,
}) => {
  const statusColor =
    commande.status === "Préparation"
      ? "bg-yellow-200"
      : commande.status === "Prêt"
      ? "bg-green-200"
      : "bg-gray-200";

  return (
    <div
      className={`${
        isSelected ? "border-2 border-purple-500" : ""
      } ${statusColor} rounded-lg shadow p-3 cursor-pointer transition-all hover:shadow-md`}
      onClick={() => onSelect(commande._id)}
    >
      <div className="flex justify-between w-full items-start">
        <div className="flex-1">
          <div className="flex items-center flex-col justify-between mb-1">
            <span className="text-xl font-extrabold px-2 py-0.5 rounded-full bg-opacity-80 text-black">
              {commande.status}
            </span>
          </div>
          <div className="flex items-center justify-start mb-2">
            <img
              src={restaurant?.url}
              alt="Logo"
              className="h-32 w-32 object-cover rounded-lg mb-2"
            />
            <div className="flex flex-col justify-center ml-2">
              <h3 className="font-semibold mx-2">
                {restaurant?.restaurantName || "Restaurant inconnu"}
              </h3>
              <p className="text-sm mx-2 text-gray-600 break-words">
                {restaurant?.address || "Adresse inconnue"}
              </p>
            </div>
          </div>

          <div className="items-center mt-2">
            <div className="border-l-2 border-gray-300 pl-2 my-2 ml-2">
              <img src={CompteLogo} alt="Logo" className="w-6 h-6 m-2" />
              <h3 className="font-semibold">
                {client?.name || "Client inconnu"}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {client?.address || "Adresse inconnue"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-2">
          <Link
            to={`/livreur/livraison/${commande._id}`}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
            title="Accepter la livraison"
          >
            <FaWalking className="text-lg" />
          </Link>

          <button
            onClick={(e) => onHide(commande._id, e)}
            className="bg-gray-200 text-gray-600 p-2 rounded-full hover:bg-gray-300 transition-colors"
            title="Masquer cette commande"
          >
            <FaTrash className="text-lg" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommandeItem;
