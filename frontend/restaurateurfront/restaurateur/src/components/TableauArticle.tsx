import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Swal from 'sweetalert2';

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

function TableauArticle() {
    const [articles, setArticles] = useState<IArticle[]>([]);
    const [isLoading, setIsLoading] = useState(false);
  
    const getArticles = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("http://localhost:3005/api/articles");
            setArticles(response.data);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    };
  
    useEffect(() => {
        getArticles();
    }, []);

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
                await axios.delete(`http://localhost:3005/api/articles/${id}`);
                toast.success("Article supprimé avec succès");
                getArticles();
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
                                    <th className="border px-4 py-2">Nom</th>
                                    <th className="border px-4 py-2">Référence</th>
                                    <th className="border px-4 py-2">Type</th>
                                    <th className="border px-4 py-2">Prix</th>
                                    <th className="border px-4 py-2">Stock</th>
                                    <th className="border px-4 py-2">Restaurant</th>
                                    <th className="border px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {articles.map((article, index) => (
                                    <tr key={index} className="border">
                                        <td className="border px-4 py-2">{article.name}</td>
                                        <td className="border px-4 py-2">{article.reference}</td>
                                        <td className="border px-4 py-2">{article.type}</td>
                                        <td className="border px-4 py-2">{article.price}€</td>
                                        <td className="border px-4 py-2">{article.isInStock ? "En stock" : "Rupture de stock"}</td>
                                        <td className="border px-4 py-2">{article.restaurantid}</td>
                                        <td className="border px-4 py-2 flex gap-2">
                                        <Link to={`/edit-article/${article._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer">
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
