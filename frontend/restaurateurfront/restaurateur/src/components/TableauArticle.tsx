import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
import { useAuth } from "react-oidc-context";


interface IArticle {
    _id: string;
    name: string;
    reference: string;
    type: 'plat' | 'boisson' | 'sauce' | 'accompagnement';
    price: number;
    isInStock: boolean;
    image?: string;
    restaurantid?: string;
}

interface IRestaurateur {
    _id: string;
    managerName: string;
    email: string;
    restaurantName: string;
    address: string;
    phone: string;
    name: string;
    position: [number, number];
    url: string;
    managerId: string;
  }

function TableauArticle() {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [restaurant, setRestaurant] = useState<IRestaurateur>();


    const auth = useAuth();

    const getRestaurateurByManagerId = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(
                `http://localhost:8080/api/restaurateurs/manager/${auth.user?.profile.sub}`
            );
            if (response.data.length > 0) {
                setRestaurant(response.data[0]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    


    const getArticlesByRestaurant = async () => {
        try {
            setIsLoading(true);

            const response = await axios.get(`http://localhost:8080/api/articles/restaurateur/${restaurant?._id}`);
            setArticles(response.data);
            setIsLoading(false);

            
        } catch (error) {
            console.log(error);
        }
    };
  
        useEffect(() => {
            getRestaurateurByManagerId();
        }, []);
        
        useEffect(() => {
            if (restaurant?._id) {
                getArticlesByRestaurant();
            }
        }, [restaurant]); 
  

    const deleteArticle = async (id: string) => {
        const result = await Swal.fire({
            title: "Voulez-vous vraiment supprimer cet article ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer !"
        });
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:8080/api/articles/${id}`);
                toast.success("Article supprimé avec succès");
                getArticlesByRestaurant();
            } catch (error: any) {
                toast.error(error.message);
            }
        }
    };
  
    return (
        <div className='mt-5'>
            {isLoading ? ("Loading") : (
                <>
                    {articles.length > 0 ? (
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="border px-4 py-2">_id</th>
                                    <th className="border px-4 py-2">Nom</th>
                                    <th className="border px-4 py-2">Référence</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Prix</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article, index) => (
                                    <tr key={index} className="border">
                                        <td className="border px-4 py-2">{article._id}</td>
                                        <td className="border px-4 py-2">{article.name}</td>
                                        <td className="border px-4 py-2">{article.reference}</td>
                                        <td className="border px-4 py-2">{article.type}</td>
                                        <td className="border px-4 py-2">{article.price}€</td>
                                        <td className="px-4 py-2 flex gap-2">
                                        <Link to={`/restaurateur/edit-article/${article._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer">
                                          Modifier
                                        </Link>
                                        <button onClick={() => deleteArticle(article._id)} className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer">
                                            Supprimer
                                        </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div>Aucun article disponible</div>
                    )}
                </>
            )}
        </div>
    );
}

export default TableauArticle;
