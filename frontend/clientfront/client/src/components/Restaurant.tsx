import React from "react";
import FavoriteLogo from "../assets/icons/heart.fill.svg";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

const Restaurant: React.FC<RestaurantProps> = ({ id, name, address, ville, phone, url, position, onDelete }) => {
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
                await axios.delete(`http://localhost:3001/api/restaurateurs/${id}`);
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

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="relative">
                <img 
                    src={url} 
                    alt={name} 
                    className="w-full h-48 object-cover"
                />
                <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100">
                    <img src={FavoriteLogo} alt="Favoris" className="w-5 h-5" />
                </button>
            </div>
            
            <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{name}</h2>
                
                <p className="text-gray-600 text-sm mb-1">
                    <span className="font-medium">Adresse :</span> {address}
                </p>

                
                <div className="flex justify-between items-center mt-4">
                    
                    {id && (
                        <div className="flex gap-2">
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
                </div>
            </div>
        </div>
    );
};

export default Restaurant;
