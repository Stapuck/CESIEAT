import React from "react";
import FavoriteLogo from "../../assets/icons/heart.fill.svg";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Swal from 'sweetalert2';

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

/**
 * A React functional component that represents a restaurant card.
 * It displays the restaurant's image, name, address, and provides options
 * to navigate to the restaurant's menus, edit the restaurant, or delete it.
 *
 * @component
 * @param {RestaurantProps} props - The properties passed to the component.
 * @param {string} props.id - The unique identifier of the restaurant.
 * @param {string} props.name - The name of the restaurant.
 * @param {string} props.address - The address of the restaurant.
 * @param {string} props.url - The URL of the restaurant's image.
 * @param {() => void} [props.onDelete] - Optional callback function to refresh the restaurant list after deletion.
 *
 * @returns {JSX.Element} A styled card component for a restaurant.
 *
 * @remarks
 * - Clicking on the card navigates to the restaurant's menu page.
 * - The delete button prompts a confirmation dialog using SweetAlert before deleting the restaurant.
 * - The edit button navigates to the restaurant editing page.
 * - The "Voir les menus" button explicitly navigates to the restaurant's menu page.
 *
 * @example
 * ```tsx
 * <Restaurant
 *   id="1234567890abcdef12345678"
 *   name="Chez Gourmet"
 *   address="123 Rue de Paris, France"
 *   url="https://example.com/image.jpg"
 *   onDelete={() => console.log('Restaurant deleted')}
 * />
 * ```
 */
const Restaurant: React.FC<RestaurantProps> = ({ id, name, address, url, onDelete }) => {
    const navigate = useNavigate();

    // Fonction pour supprimer directement un restaurant avec SweetAlert
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault(); // Empêcher le comportement par défaut
        e.stopPropagation(); // Arrêter la propagation de l'événement

        const result = await Swal.fire({
            title: `Supprimer ${name} ?`,
            text: "Cette action est irréversible!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/restaurateurs/${id}`);
                toast.success(`Restaurant "${name}" supprimé avec succès`);
                // Rafraîchir la liste si la fonction de rappel est fournie
                if (onDelete) {
                    onDelete();
                }
            } catch (error: any) {
                toast.error(`Erreur lors de la suppression : ${error.message}`);
            }
        }
    };

    // Fonction pour naviguer vers la page des menus du restaurant
    const goToRestaurantMenus = () => {
        if (id && /^[0-9a-fA-F]{24}$/.test(id)) {
            // Utiliser un slug dans l'URL basé sur le nom du restaurant pour SEO
            const restaurantSlug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
            navigate(`/client/restaurant/${restaurantSlug}`, { 
                state: { 
                    restaurantId: id,
                    restaurantName: name,
                    restaurantImage: url
                } 
            });
        } else {
            console.error("ID de restaurant invalide:", id);
            toast.error("ID de restaurant invalide. Impossible de naviguer vers les menus.");
        }
    };

    return (
        <div
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
            onClick={goToRestaurantMenus}
        >
            <div className="relative">
                <img
                    src={url}
                    alt={name}
                    className="w-full h-48 object-cover"
                />
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
