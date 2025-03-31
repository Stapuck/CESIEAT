import React, { useEffect, useState } from 'react';
import { Link, useLocation as useRestaurant, useNavigate, useParams } from 'react-router-dom';
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

interface RestaurantState {
    restaurantId: string;
    restaurantName?: string;
    restaurantImage?: string;
}

interface Article{
    _id: string;
    name: string;
    price: number;
    image: string;
}


const ShowRestaurantMenu: React.FC = () => {
    const restaurant = useRestaurant();
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const state = restaurant.state as RestaurantState | null;

    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [restaurantImage, setRestaurantImage] = useState<string>('');
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        // Si on n'a pas d'état (accès direct à l'URL), afficher un message et rediriger
        if (!state || !state.restaurantId) {
            toast.error("Information de restaurant manquante. Redirection vers l'accueil...");
            navigate('/client/');
            return;
        }

        if (state.restaurantName) {
            setRestaurantName(state.restaurantName);
            // Mettre à jour le titre de la page pour SEO
            document.title = `Menus de ${state.restaurantName} | CESIEAT`;
        }

        if (state.restaurantImage) {
            setRestaurantImage(state.restaurantImage);
        }
    }, [state, navigate, slug]);

    useEffect(() => {
        const fetchMenus = async () => {
            if (!state || !state.restaurantId) return;

            try {
                setLoading(true);

                if (!/^[0-9a-fA-F]{24}$/.test(state.restaurantId)) {
                    throw new Error("ID de restaurant invalide");
                }
                console.log("Fetching menus for restaurateur ID:", state.restaurantId);

                // Utiliser directement l'ID comme paramètre de requête pour simplicité maximale
                const response = await axios.get(`http://localhost:8080/api/menus/byRestaurant?id=${state.restaurantId}`);
                console.log("Réponse du backend:", response);

                if (response.data && response.data.length > 0) {
                    console.log("Menus fetched successfully:", response.data);
                    setMenus(response.data); 
                } else {
                    console.warn("Aucun menu trouvé pour ce restaurateur. Réponse:", response.data);
                    toast.warn("Aucun menu disponible pour ce restaurateur.");
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    console.error("Erreur Axios:", error.response?.data);
                    if (error.response?.status === 404) {
                        toast.error("Menus introuvables pour ce restaurateur.");
                    } else {
                        toast.error("Erreur lors de la récupération des menus.");
                    }
                } else {
                    console.error("Erreur lors de la récupération des menus:", error);
                    toast.error("Impossible de charger les menus du restaurateur.");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [state, navigate]); // Dépendance sur `state` pour recharger les menus si l'état change

    const fetchArticleName = async (id: string) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/articles/${id}`);

            setArticles((prev) => [...prev, response.data]);

            return response.data.name;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'article ${id}:`, error);
            return 'Article inconnu';
        }
    };

    useEffect(() => {
        const fetchArticles = async () => {
            const articlePromises = menus.flatMap((menu) =>
                menu.articles.map(async (_id: string) => {
                    if (!articles.some((article) => article._id === _id)) {
                        await fetchArticleName(_id);

                    }
                })
            );

            await Promise.all(articlePromises);
        };

        fetchArticles();
    }, [menus]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="relative mb-6 w-full ">
                <img
                    className="bg-cover w-full h-100 object-cover bg-center"
                    src={restaurantImage}
                    alt="Restaurant"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
                    <h1 className="text-3xl text-black bg-gradient-left p-3 outline-4 px-5 shadow-2xl font-extrabold">
                        {restaurantName ? `Menus de ${restaurantName}` : 'Menus du restaurant'}
                    </h1>
                </div>
            </div>

            <Link to="/client/create-menu">
                <button className="bg-text-search-color text-white px-4 py-2 rounded-lg ml-2 mb-7 hover:bg-blue-700 transition duration-300">
                    Ajouter un menu
                </button>
            </Link>

            {menus.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 z-1 p-3 gap-6 rounded-2xl">
                    {menus.map((menu) => (
                        <div key={menu._id} className="rounded-lg shadow-md bg-white text-black overflow-hidden relative h-80">
                            <div className="p-6 relative z-20 h-full flex flex-col">
                                <h2 className="text-2xl font-bold mb-2">{menu.name}</h2>
                                <p className="mb-3 text-lg">Prix: {menu.price}€</p>

                                <h3 className="font-semibold mt-4 mb-2">Articles inclus:</h3>
                                {menu.articles && menu.articles.length > 0 ? (
                                    <ul className="list-disc list-inside">
                                        {menu.articles.map((_id: string) => (
                                            <li key={_id} className="mb-1">
                                                {articles.find((article) => article._id === _id)?.name || 'Chargement...'}
                                                <img src={articles.find((article) => article._id === _id)?.image} alt={articles.find((article) => article._id === _id)?.name} className="w-10 h-10 rounded-full ml-2" />
        
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-black italic">Aucun article dans ce menu</p>
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