import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "react-oidc-context";

const CreateRestaurant = () => {
    const auth = useAuth();
    const [restaurantName, setRestaurantName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [url, setUrl] = useState("");
    const [position, setPosition] = useState("");
    const [managerName, setManagerName] = useState(auth.user?.profile.given_name);
    const [email, setEmail] = useState(auth.user?.profile.email);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const saveRestaurant = async (e: any) => {
        e.preventDefault();

        if (!restaurantName || !address || !phone || !url || !position || !managerName || !email ) {
            toast.error("Veuillez remplir tous les champs");
        }

        // Convertir position en tableau de nombres
        const formattedPosition = position.split(",").map(coord => parseFloat(coord.trim()));

        if (formattedPosition.length !== 2 || isNaN(formattedPosition[0]) || isNaN(formattedPosition[1])) {
            toast.error("Veuillez entrer une position valide (format: lat, lng)");
            return;

        }      

        try {
            setIsLoading(true);
            await axios.post("https://cesieat.nathan-lorit.com/api/restaurateurs", {
                restaurantName,
                address,
                phone,
                url_image : url,
                position : formattedPosition,
                managerName,
                email,
                managerId_Zitadel: auth.user?.profile.sub
            });

            toast.success("Restaurant créé avec succès");
            setIsLoading(false);
            navigate("/restaurateur");
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 mt-25 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 text-center">Créer un restaurant</h2>
            <form onSubmit={saveRestaurant}>
                <div className="space-y-2">
                    <div>
                        <label>Nom du restaurant</label>
                        <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full block border p-3 rounded" placeholder="Nom du restaurant" />
                    </div>
                    <div>
                        <label>Adresse</label>
                        <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full block border p-3 rounded" placeholder="Adresse" />
                    </div>
                    <div>
                        <label>Téléphone</label>
                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full block border p-3 rounded" placeholder="Téléphone" />
                    </div>
                    <div>
                        <label>Image URL</label>
                        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full block border p-3 rounded" placeholder="URL de l'image" />
                    </div>
                    <div>
                        <label>Position (lat, lng)</label>
                        <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="w-full block border p-3 rounded" placeholder="Position" />
                    </div>
                    <div>
                        <label>Nom du manager</label>
                        <input type="text" value={managerName} onChange={(e) => setManagerName(e.target.value)} className="w-full block border p-3 rounded" placeholder="Nom du manager" />
                    </div>
                    <div>
                        <label>Email du manager</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full block border p-3 rounded" placeholder="Email" />
                    </div>
                    <div className="hidden">
                        <label>ID du manager</label>
                        <input type="text" value={auth.user?.profile.sub} className="w-full block border p-3 rounded" placeholder="ID du manager" />
                    </div>
                    <div>
                        {!isLoading && (
                            <div>
                                <button className="block w-full mt-6 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-600">
                                    Enregistrer
                                </button>
                                <button type="button" onClick={() => navigate(-1)}
                                    className="block w-full mt-4 bg-gray-500 text-white rounded px-4 py-2 font-bold hover:bg-gray-600 text-center">
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

export default CreateRestaurant;