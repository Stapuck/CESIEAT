import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [name, setName] = useState("");
    const [reference, setReference] = useState("");
    const [type, setType] = useState("");
    const [price, setPrice] = useState<number>();
    const [isInStock, setIsInStock] = useState(true);
    const [image, setImage] = useState("");
    const [restaurantid, setRestaurantId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/articles/${id}`);
                const article = response.data;
                setName(article.name);
                setReference(article.reference);
                setType(article.type);
                setPrice(article.price);
                setIsInStock(article.isInStock);
                setImage(article.image);
                setRestaurantId(article.restaurantid);
            } catch (error) {
                console.error(error);
                toast.error("Erreur lors de la récupération de l'article");
            }
        };

        fetchArticle();
    }, [id]);

    const updateArticle = async (e: any) => {
        e.preventDefault();

        if (!name || !reference || !type || !price || !image || !restaurantid) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        try {
            setIsLoading(true);
            await axios.put(`http://localhost:8080/api/articles/${id}`, {
                name,
                reference,
                type,
                price,
                isInStock,
                image,
                restaurantid
            });

            toast.success("Article mis à jour avec succès");
            setIsLoading(false);
            navigate("/article");
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 text-center">Modifier l'article</h2>
            <form onSubmit={updateArticle}>
                <div className="space-y-2">
                    <div>
                        <label>Nom</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full block border p-3 rounded" />
                    </div>
                    <div>
                        <label>Référence</label>
                        <input type="text" value={reference} onChange={(e) => setReference(e.target.value)} className="w-full block border p-3 rounded" />
                    </div>
                    <div>
                        <label>Type</label>
                        <select value={type} onChange={(e) => setType(e.target.value)} className="w-full block border p-3 rounded">
                            <option value="">Sélectionnez un type</option>
                            <option value="plat">Plat</option>
                            <option value="boisson">Boisson</option>
                            <option value="sauce">Sauce</option>
                            <option value="accompagnement">Accompagnement</option>
                        </select>
                    </div>
                    <div>
                        <label>Prix</label>
                        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full block border p-3 rounded" />
                    </div>
                    <div>
                        <label>En stock</label>
                        <input type="checkbox" checked={isInStock} onChange={(e) => setIsInStock(e.target.checked)} className="ml-2" />
                    </div>
                    <div>
                        <label>Image URL</label>
                        <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full block border p-3 rounded" />
                    </div>
                    <div>
                        <label>ID du restaurant</label>
                        <input type="text" value={restaurantid} onChange={(e) => setRestaurantId(e.target.value)} className="w-full block border p-3 rounded" />
                    </div>
                    <div>
                        {!isLoading && (
                            <div>
                            <button className="block w-full mt-6 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-600">
                                Enregistrer
                            </button>
                            <button type="button" onClick={() => navigate(-1)}
                            className="block w-full mt-4 bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 text-center"
                            >
                            Retour
                            </button>
                            </div>
                            
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;
