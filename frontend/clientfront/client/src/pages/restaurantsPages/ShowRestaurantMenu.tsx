import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Menu {
    _id: string;
    name: string;
    price: number;
    articles: any[];
    restaurant: string;
    createdAt: string;
    updatedAt: string;
}

interface LocationState {
    restaurantId: string;
    restaurantName?: string;
}

const ShowRestaurantMenu: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const state = location.state as LocationState;
    
    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [restaurantName, setRestaurantName] = useState<string>('');

    // Rediriger vers la page d'accueil si aucun état n'est passé
    useEffect(() => {
        if (!state || !state.restaurantId) {
            toast.error("Information de restaurant manquante");
            navigate('/');
            return;
        }
        
        // Si le nom du restaurant est fourni dans le state, l'utiliser
        if (state.restaurantName) {
            setRestaurantName(state.restaurantName);
        }
    }, [state, navigate]);

    useEffect(() => {
        const fetchMenus = async () => {
            if (!state || !state.restaurantId) return;
            
            try {
                setLoading(true);
                
                // Utiliser un endpoint POST ou GET avec body pour éviter l'ID dans l'URL
                const response = await axios.post(`http://localhost:3006/api/menus/restaurant`, {
                    restaurantId: state.restaurantId
                });
                
                console.log("Menus récupérés:", response.data);
                setMenus(response.data);
                
                // Si le nom du restaurant n'est pas dans le state, le récupérer
                if (!state.restaurantName) {
                    try {
                        // Utiliser POST pour éviter d'exposer l'ID dans l'URL
                        const restaurantResponse = await axios.post(`http://localhost:3001/api/restaurateurs/details`, {
                            id: state.restaurantId
                        });
                        setRestaurantName(restaurantResponse.data.name);
                    } catch (error) {
                        console.error("Erreur lors de la récupération des détails du restaurant:", error);
                    }
                }
            } catch (error) {
                console.error("Erreur lors de la récupération des menus:", error);
                toast.error("Impossible de charger les menus du restaurant");
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [state]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                {restaurantName ? `Menus de ${restaurantName}` : 'Menus du restaurant'}
            </h1>

            {menus.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menus.map((menu) => (
                        <div key={menu._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2">{menu.name}</h2>
                                <p className="text-gray-700 mb-3">Prix: {menu.price}€</p>
                                
                                <h3 className="font-semibold mt-4 mb-2">Articles inclus:</h3>
                                {menu.articles && menu.articles.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {menu.articles.map((article, index) => (
                                            <li key={index} className="text-gray-700">{article.name}</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500 italic">Aucun article dans ce menu</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-700">
                        Aucun menu disponible pour ce restaurant.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShowRestaurantMenu;