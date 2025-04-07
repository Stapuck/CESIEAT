import React from "react";
import FavoriteLogo from "@assets/icons/heart.fill.svg";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RestaurantProps {
  id?: string;
  name: string;
  address: string;
  ville: string;
  phone: string;
  url: string;
  position: [number, number];
  onDelete?: () => void; // Pour rafraîchir la liste après suppression
}

const Restaurant: React.FC<RestaurantProps> = ({
  id,
  name,
  address,
  url,
}) => {
  const navigate = useNavigate();

  // Fonction pour supprimer directement un restaurant avec SweetAlert

  // Fonction pour naviguer vers la page des menus du restaurant
  const goToRestaurantMenus = () => {
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
          restaurantImage: url,
        },
      });
    } else {
      console.error("ID de restaurant invalide:", id);
      toast.error(
        "ID de restaurant invalide. Impossible de naviguer vers les menus."
      );
    }
  };

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={goToRestaurantMenus}
    >
      <div className="relative">
        <img src={url} alt={name} className="w-full h-48 object-cover" />
        <button
          className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation(); // Empêche le clic de propager au parent
          }}
        >
          <img src={FavoriteLogo} alt="Favoris" className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>

        <p className="text-gray-600 text-sm mb-1">
          <span className="font-medium">Adresse :</span> {address}
        </p>

        {/* <div className="flex justify-between items-center mt-4">
                    {id && (
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                            <Link
                                to={`/edit-restaurant/${id}`}
                                className="bg-button-background text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition-colors text-sm"
                            >
                                Modifier
                            </Link>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                            >
                                Supprimer
                            </button>
                        </div>
                    )}
                </div>*/}

        {/* Bouton pour voir les menus */}
        <button
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
          onClick={(e) => {
            e.preventDefault(); // Empêcher toute navigation par défaut
            e.stopPropagation(); // Arrêter la propagation de l'événement
            goToRestaurantMenus(); // Appel direct à la fonction avec l'ID
          }}
        >
          Voir les menus
        </button>
      </div>
    </div>
  );
};

export default Restaurant;
