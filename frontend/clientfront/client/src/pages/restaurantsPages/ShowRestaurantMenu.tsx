import React, { useEffect, useState } from 'react';
import { Link, useLocation as useRestaurant, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import useCart from '../../hooks/useCart';
import { motion } from "motion/react";
import { useAuth } from 'react-oidc-context';

interface Menu {
    _id: string;
    name: string;
    price: number;
    articles: any[];
    restaurateur: string;
    createdAt: string;
    updatedAt: string;
}

interface RestaurantState {
    restaurantId: string;
    restaurantName?: string;
    restaurantImage?: string;
}

interface Article {
    _id: string;
    name: string;
    price: number;
    image: string;
    type?: string;
    isInStock?: boolean;
}

interface ShowRestaurantMenuProps {
    login?: boolean;
}

interface OutletContextType {
    login: boolean;
}

const ShowRestaurantMenu: React.FC<ShowRestaurantMenuProps> = (props) => {
    // Récupérer l'état de connexion de multiples sources
    const outletContext = useOutletContext<OutletContextType | null>();
    const auth = useAuth(); // Récupération directe de l'état d'authentification
    
    // Utiliser auth.isAuthenticated comme source primaire, puis les props, puis le contexte outlet
    const login = auth.isAuthenticated || props.login || outletContext?.login || false;
    
    // Log pour débogage
    useEffect(() => {
        console.log("État de connexion:", { 
            authIsAuthenticated: auth.isAuthenticated,
            propsLogin: props.login,
            outletContextLogin: outletContext?.login,
            finalLogin: login 
        });
    }, [auth.isAuthenticated, props.login, outletContext, login]);

    const restaurant = useRestaurant();
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();
    const state = restaurant.state as RestaurantState | null;
    const { addItemToCart } = useCart();

    const [menus, setMenus] = useState<Menu[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [restaurantName, setRestaurantName] = useState<string>('');
    const [restaurantImage, setRestaurantImage] = useState<string>('');
    const [articles, setArticles] = useState<Record<string, Article>>({});
    const [restaurantId, setRestaurantId] = useState<string>('');

    useEffect(() => {
        // Si on n'a pas d'état (accès direct à l'URL), afficher un message et rediriger
        if (!state || !state.restaurantId) {
            toast.error("Information de restaurant manquante. Redirection vers l'accueil...");
            navigate('/client/');
            return;
        }

        // Stocker l'ID du restaurant dans l'état local seulement si c'est une valeur valide
        if (state.restaurantId && /^[0-9a-fA-F]{24}$/.test(state.restaurantId)) {
            setRestaurantId(state.restaurantId);
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

    // Séparons l'effet de chargement des menus pour éviter les cycles de re-rendu
    useEffect(() => {
        const fetchMenus = async () => {
            if (!restaurantId || !(/^[0-9a-fA-F]{24}$/.test(restaurantId))) {
                return; // N'exécute pas la requête si on n'a pas d'ID valide
            }
            
            try {
                setLoading(true);
                
                // Récupérer tous les menus
                const response = await axios.get('http://localhost:8080/api/menus');
                
                if (response.data && response.data.length > 0) {
                    // Filtrer les menus par restaurant

                    const filteredMenus = response.data.filter(
                        (menu: Menu) => {
                            if (Array.isArray(menu.restaurateur)) {
                                return menu.restaurateur.includes(restaurantId);
                            } else {
                                return menu.restaurateur === restaurantId;
                            }
                        }
                    );

                    
                    if (filteredMenus.length > 0) {
                        setMenus(filteredMenus);
                    } else {
                        toast.warn("Aucun menu disponible pour ce restaurateur.");
                        setMenus([]);
                    }
                } else {
                    toast.warn("Aucun menu disponible.");
                    setMenus([]);
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error("Erreur lors de la récupération des menus.");
                } else {
                    toast.error("Impossible de charger les menus.");
                }
                setMenus([]);
            } finally {
                setLoading(false);
            }
        };

        fetchMenus();
    }, [restaurantId]); // On ne dépend que de l'ID du restaurant

    const fetchArticleDetails = async (id: string) => {
        if (articles[id]) return;
        
        try {
            const response = await axios.get(`http://localhost:8080/api/articles/${id}`);
            setArticles(prev => ({
                ...prev,
                [id]: {
                    ...response.data,
                    isInStock: response.data.isInStock ?? true,
                    type: response.data.type ?? 'Non spécifié'
                }
            }));
            return response.data;
        } catch (error) {
            return null;
        }
    };

    useEffect(() => {
        // Préchargement des articles
        const fetchAllArticles = async () => {
            const articleIds = menus.flatMap(menu => 
                menu.articles.map(articleId => articleId));
            
            const uniqueArticleIds = [...new Set(articleIds)];
            
            for (const articleId of uniqueArticleIds) {
                if (!articles[articleId]) {
                    await fetchArticleDetails(articleId);
                }
            }
        };

        if (menus.length > 0) {
            fetchAllArticles();
        }
    }, [menus]);

    const handleAddToCart = (menu: Menu) => {
        if (!menu._id || !menu.restaurateur) {
            toast.error("Impossible d'ajouter ce menu au panier: informations manquantes");
            return;
        }

        try {
            const itemToAdd = {
                id: menu._id,
                name: menu.name,
                price: menu.price,
                quantity: 1,
                restaurantId: menu.restaurateur,
                image: articles[menu.articles[0]]?.image || '',
            };

            addItemToCart(itemToAdd);

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: `${menu.name} a été ajouté à votre panier`,
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            toast.error("Impossible d'ajouter ce menu au panier");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            <div className="relative mb-6 w-full">
                <img
                    className="bg-cover w-full h-100 object-cover bg-center"
                    src={restaurantImage}
                    alt="Restaurant"
                />
                  <motion.div initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.0,
                    scale: { type: "spring", visualDuration: 0.0, bounce: 0.0 },
                }}
                 className="absolute inset-0 flex items-center justify-center bg-transparent bg-opacity-50">
                    <h1 className="text-3xl text-black bg-gradient-left p-3 outline-4 px-5 shadow-2xl font-extrabold">
                        {restaurantName ? `Menus de ${restaurantName}` : 'Menus du restaurant'}
                    </h1>
                </motion.div>
            </div>

            <Link to="/client/create-menu" state={{ restaurantId }}>
                <button className="bg-text-search-color text-white px-4 py-2 rounded-lg ml-2 mb-7 hover:bg-blue-700 transition duration-300">
                    Ajouter un menu
                </button>
            </Link>

            {menus.length > 0 ? (
                <div className="container mx-auto py-8 px-4">
                    <h1 className="text-3xl font-bold mb-6">Nos menus</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {menus.map((menu) => (
                            <div key={menu._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold mb-3">{menu.name}</h2>
                                    
                                    <div className="mb-4">
                                        <h3 className="font-medium mb-2">Contenu du menu:</h3>
                                        <ul className="divide-y divide-gray-200">
                                            {menu.articles && menu.articles.length > 0 ? (
                                                menu.articles.map((articleId, index) => {
                                                    const articleDetails = articles[articleId];
                                                    if (!articleDetails) {
                                                        fetchArticleDetails(articleId);
                                                    }

                                                    return (
                                                        <li key={`${menu._id}-${articleId}-${index}`} className="py-2">
                                                            <div className="flex flex-col md:flex-row">
                                                                {articleDetails?.image && (
                                                                    <img
                                                                        src={articleDetails.image}
                                                                        alt={articleDetails.name || ""}
                                                                        className="w-20 h-20 object-cover rounded mr-3 mb-2 md:mb-0"
                                                                    />
                                                                )}
                                                                <div>

                                                                    <p className="font-medium">{articleDetails?.name || 'Chargement...'}</p>
                                                                    <p className="text-sm text-gray-600">{articleDetails?.type || 'Chargement...'}</p>
                                                                    <p className="text-sm">{articleDetails?.isInStock ? 'En stock' : 'Rupture de stock'}</p>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <li key={`${menu._id}-no-articles`}>Aucun article disponible pour ce menu.</li>
                                            )}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex justify-between items-center pt-3 border-t">
                                        <div>
                                            <p className="text-lg font-bold text-amber-600">{menu.price.toFixed(2)} €</p>
                                        </div>
                                        {/* Modifier la condition pour afficher le bouton */}
                                        {(login === true || auth.isAuthenticated === true) && (
                                            <button
                                                onClick={() => handleAddToCart(menu)}
                                                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                                            >
                                                Ajouter au panier
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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