import React from 'react';
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

interface IArticle {
    _id: string;
    name: string;
    price: number;
    description?: string;
}

interface IRestaurant {
    _id: string;
    restaurantName: string;
}

const EditMenu = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [price, setPrice] = useState<number>(0);
    const [selectedArticles, setSelectedArticles] = useState<string[]>([]);
    const [restaurantId, setRestaurantId] = useState("");
    const [restaurants, setRestaurants] = useState<IRestaurant[]>([]);
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const navigate = useNavigate();

    // Récupérer les détails du menu existant
    useEffect(() => {
        const fetchMenuDetails = async () => {
            if (!id) return;
            
            try {
                setIsFetching(true);
                const response = await axios.get(`http://localhost:8080/api/menus/${id}`);
                const menu = response.data;
                
                setName(menu.name || "");
                setPrice(menu.price || 0);
                setSelectedArticles(menu.articles || []);
                setRestaurantId(menu.restaurant || "");
                
                setIsFetching(false);
            } catch (error: any) {
                toast.error(`Erreur lors de la récupération du menu: ${error.message}`);
                setIsFetching(false);
                navigate('/');
            }
        };
        
        fetchMenuDetails();
    }, [id, navigate]);

    // Récupérer la liste des restaurants
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/restaurateurs");
                setRestaurants(response.data);
            } catch (error: any) {
                toast.error(`Erreur lors de la récupération des restaurants: ${error.message}`);
            }
        };

        fetchRestaurants();
    }, []);

    // Récupérer la liste des articles
    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/articles");
                setArticles(response.data);
            } catch (error: any) {
                toast.error(`Erreur lors de la récupération des articles: ${error.message}`);
            }
        };

        fetchArticles();
    }, []);

    const handleToggleArticle = (articleId: string) => {
        setSelectedArticles(prevSelected => {
            if (prevSelected.includes(articleId)) {
                return prevSelected.filter(id => id !== articleId);
            } else {
                return [...prevSelected, articleId];
            }
        });
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        setPrice(isNaN(value) ? 0 : value);
    };

    const calculateTotalPrice = () => {
        return selectedArticles.reduce((total, articleId) => {
            const article = articles.find(a => a._id === articleId);
            return total + (article?.price || 0);
        }, 0);
    };

    const useCalculatedPrice = () => {
        setPrice(calculateTotalPrice());
        toast.info("Prix calculé en fonction des articles sélectionnés");
    };

    const updateMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!name || price <= 0 || selectedArticles.length === 0 || !restaurantId) {
            toast.error("Veuillez remplir tous les champs et sélectionner au moins un article");
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await axios.put(`http://localhost:8080/api/menus/${id}`, {
                name,
                price,
                articles: selectedArticles,
                restaurant: restaurantId
            });
           
            Swal.fire({
                title: 'Succès!',
                text: `Le menu "${response.data.name}" a été mis à jour avec succès`,
                icon: 'success',
                confirmButtonColor: '#3085d6'
            });
            
            setIsLoading(false);
            navigate("/");
        } catch (error: any) {
            toast.error(`Erreur: ${error.message}`);
            setIsLoading(false);
        }
    };

    const deleteMenu = async () => {
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
                setIsLoading(true);
                await axios.delete(`http://localhost:8080/api/menus/${id}`);
                toast.success(`Menu "${name}" supprimé avec succès`);
                setIsLoading(false);
                navigate("/");
            } catch (error: any) {
                toast.error(`Erreur lors de la suppression : ${error.message}`);
                setIsLoading(false);
            }
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-text-search-color"></div>
            </div>
        );
    }

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-24 mb-10">
            <h2 className="font-semibold text-2xl mb-4 block text-center">
                Modifier le menu
            </h2>
            <form onSubmit={updateMenu}>
                <div className="space-y-2">
                    <div>
                        <label className="block mb-1">Nom du menu</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200"
                            placeholder="Entrez le nom du menu"
                        />
                    </div>
                    
                    <div>
                        <label className="block mb-1">Restaurant</label>
                        <select
                            value={restaurantId}
                            onChange={(e) => setRestaurantId(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200"
                        >
                            {restaurants.map(restaurant => (
                                <option key={restaurant._id} value={restaurant._id}>
                                    {restaurant.restaurantName}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        <label className="block mb-1">Prix</label>
                        <div className="flex items-center">
                            <input
                                type="number"
                                value={price}
                                onChange={handlePriceChange}
                                className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200"
                                placeholder="Entrez le prix"
                                min="0"
                                step="0.01"
                            />
                            <button 
                                type="button" 
                                onClick={useCalculatedPrice}
                                className="ml-2 bg-gray-200 px-3 py-2 rounded hover:bg-gray-300 text-sm"
                            >
                                Calculer
                            </button>
                        </div>
                    </div>
                    
                    <div>
                        <label className="block mb-1">Articles (sélectionnez au moins un)</label>
                        <div className="max-h-60 overflow-y-auto border rounded p-2">
                            {articles.length > 0 ? (
                                articles.map(article => (
                                    <div key={article._id} className="flex items-center p-1 hover:bg-gray-50">
                                        <input
                                            type="checkbox"
                                            id={`article-${article._id}`}
                                            checked={selectedArticles.includes(article._id)}
                                            onChange={() => handleToggleArticle(article._id)}
                                            className="mr-2"
                                        />
                                        <label htmlFor={`article-${article._id}`} className="flex-1">
                                            {article.name} - {article.price.toFixed(2)}€
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center p-2">Aucun article disponible</p>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-1">
                            {selectedArticles.length} article(s) sélectionné(s) - Prix total calculé: {calculateTotalPrice().toFixed(2)}€
                        </p>
                    </div>
                    
                    <div className="flex gap-2 pt-3">
                        <button 
                            type="button" 
                            onClick={() => navigate('/')} 
                            className="block w-full bg-gray-500 text-white rounded-sm px-4 py-2 font-bold hover:bg-gray-600 hover:cursor-pointer"
                        >
                            Annuler
                        </button>
                        
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="block w-full bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer disabled:bg-blue-300"
                        >
                            {isLoading ? "Mise à jour en cours..." : "Mettre à jour"}
                        </button>
                    </div>

                    {/* Bouton de suppression */}
                    <div>
                        <button 
                            type="button" 
                            onClick={deleteMenu}
                            className="block w-full mt-2 bg-red-600 text-white rounded-sm px-4 py-2 font-bold hover:bg-red-700 hover:cursor-pointer"
                        >
                            Supprimer le menu
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditMenu;