import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import useCart from '../../hooks/useCart';

// Définir un type pour les menus
type Menu = {
    _id: string;
    name: string;
    price: number;
    article: Article[];
    restaurateur: string; // Ajout de l'ID du restaurant
};

type Article = {
    name: string;
    reference: string;
    type: 'plat' | 'boisson' | 'sauce' | 'accompagnement';
    price: number;
    isInStock: boolean;
    image: string;
    restaurantId: string;
};

const Shop: React.FC = () => {
    const [menus, setMenus] = useState<Menu[]>([]);
    const [articles, setArticles] = useState<Record<string, Article | null>>({});
    const { addItemToCart } = useCart();

    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const response = await axios.get<Menu[]>('http://localhost:8080/api/menus');
                setMenus(response.data);
            } catch (error) {
                console.error('Error fetching menus:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: 'Impossible de récupérer les menus. Veuillez réessayer plus tard.',
                });
            }
        };

        fetchMenus();
    }, []);

    const fetchArticleDetails = async (articleId: string) => {
        if (articles[articleId]) return; // Skip if already fetched

        try {
            const response = await axios.get<Article>(`http://localhost:8080/api/articles/${articleId}`);
            setArticles((prev) => ({ ...prev, [articleId]: response.data }));
        } catch (error) {
            console.error(`Error fetching article ${articleId}:`, error);
            setArticles((prev) => ({ ...prev, [articleId]: null }));
        }
    };

    const handleAddToCart = (menu: Menu) => {
        if (!menu._id || !menu.restaurateur) {
            return; // Ne pas ajouter au panier si les champs essentiels sont manquants
        }

        const itemToAdd = {
            id: menu._id,
            name: menu.name,
            price: menu.price,
            quantity: 1, // Assurez-vous que la quantité initiale est définie
            restaurantId: menu.restaurateur,
            image: '', // Ajouter une image si disponible
        };

        addItemToCart(itemToAdd);

        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${menu.name} a été ajouté à votre panier`,
            showConfirmButton: false,
            timer: 1500
        });
    };

    return (
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
                                    {menu.article && menu.article.length > 0 ? (
                                        menu.article.map((article, index) => {
                                            const articleDetails = articles[article.reference];
                                            if (!articleDetails) {
                                                fetchArticleDetails(article.reference);
                                            }

                                            // Créer une clé vraiment unique en utilisant l'ID du menu et l'index
                                            return (
                                                <li key={`${menu._id}-${article.reference}-${index}`} className="py-2">
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
                                    <p className="text-sm text-gray-600">Restaurant: {menu.restaurateur}</p>
                                    <p className="text-lg font-bold text-amber-600">{menu.price.toFixed(2)} €</p>
                                </div>
                                <button
                                    onClick={() => handleAddToCart(menu)}
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Ajouter au panier
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Shop;
