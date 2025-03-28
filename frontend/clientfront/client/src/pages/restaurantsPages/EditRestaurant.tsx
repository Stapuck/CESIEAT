import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Swal from 'sweetalert2';

// Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const EditRestaurant = () => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState("");
    const [position, setPosition] = useState<[number, number]>([46.603354, 1.888334]);
    const [managerName, setManagerName] = useState("");
    const [email, setEmail] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    // Récupérer les informations du restaurant
    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!id) return;
            
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:3001/api/restaurateurs/${id}`);
                const restaurant = response.data;
                
                setName(restaurant.name || "");
                setPosition(restaurant.position || [46.603354, 1.888334]);
                setManagerName(restaurant.managerName || "");
                setEmail(restaurant.email || "");
                setRestaurantName(restaurant.restaurantName || "");
                setAddress(restaurant.address || "");
                setPhone(restaurant.phone || "");
                setUrl(restaurant.url || "");
                
                setIsLoading(false);
            } catch (error: any) {
                toast.error(`Erreur lors de la récupération du restaurant: ${error.message}`);
                setIsLoading(false);
                navigate('/');
            }
        };
        
        fetchRestaurant();
    }, [id, navigate]);

    const updateRestaurant = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !position || !managerName || !email || !restaurantName || !address || !phone || !url) {
            toast.error("Veuillez remplir tous les champs");
            return;
        }

        try {
            setIsSubmitting(true);
            const response = await axios.put(`http://localhost:3001/api/restaurateurs/${id}`, {
                name,
                position,
                managerName,
                email,
                restaurantName,
                address,
                phone,
                url,
            });

            toast.success(`Restaurant "${response.data.restaurantName}" mis à jour avec succès`);
            setIsSubmitting(false);
            navigate("/");
        } catch (error: any) {
            toast.error(error.message);
            setIsSubmitting(false);
        }
    };

    // Fonction pour supprimer un restaurant avec SweetAlert
    const deleteRestaurant = async () => {
        const result = await Swal.fire({
            title: `Supprimer ${restaurantName} ?`,
            text: "Cette opération ne peut pas être annulée!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Oui, supprimer!',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                setIsSubmitting(true);
                await axios.delete(`http://localhost:3001/api/restaurateurs/${id}`);
                toast.success(`Restaurant "${restaurantName}" supprimé avec succès`);
                setIsSubmitting(false);
                navigate("/");
            } catch (error: any) {
                toast.error(`Erreur lors de la suppression : ${error.message}`);
                setIsSubmitting(false);
            }
        }
    };

    // Fonction pour récupérer l'adresse à partir des coordonnées
    const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
            );
            const fetchedAddress = response.data.display_name;
            setAddress(fetchedAddress);
            toast.info(`Adresse mise à jour: ${fetchedAddress}`);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse :", error);
            toast.error("Impossible de récupérer l'adresse à partir des coordonnées");
        }
    };

    // Composant pour gérer les clics sur la carte
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                fetchAddressFromCoordinates(lat, lng);
            },
        });

        return position ? <Marker position={position} icon={customIcon}></Marker> : null;
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-text-search-color"></div>
            </div>
        );
    }

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-24 mb-10">
            <h2 className="font-semibold text-2xl mb-4 block text-center">
                Modifier le Restaurant
            </h2>
            <form onSubmit={updateRestaurant}>
                <div className="space-y-2">
                    <div>
                        <label>Nom</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer le nom"
                        />
                    </div>
                    <div>
                        <label>Nom du gérant</label>
                        <input
                            type="text"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer le nom du gérant"
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer l'email"
                            readOnly
                        />
                        <small className="text-gray-500">L'email ne peut pas être modifié</small>
                    </div>
                    <div>
                        <label>Nom du restaurant</label>
                        <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer le nom du restaurant"
                        />
                    </div>
                    <div>
                        <label>Adresse</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer l'adresse"
                        />
                    </div>

                    <div>
                        <label>Position (Sélectionner sur la carte)</label>
                        <div className="h-64 w-full rounded-lg overflow-hidden">
                            <MapContainer
                                center={position}
                                zoom={6}
                                scrollWheelZoom={true}
                                className="h-full w-full"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                />
                                <LocationMarker />
                            </MapContainer>
                        </div>
                    </div>
                    
                    <div>
                        <label>Téléphone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer le téléphone"
                        />
                    </div>
                    <div>
                        <label>URL de l'image</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Entrer l'URL de l'image"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            <button 
                                type="button" 
                                onClick={() => navigate('/')} 
                                className="block w-full mt-6 bg-gray-500 text-white rounded-sm px-4 py-2 font-bold hover:bg-gray-600 hover:cursor-pointer"
                            >
                                Annuler
                            </button>
                            
                            {!isSubmitting && (
                                <button 
                                    type="submit" 
                                    className="block w-full mt-6 bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer"
                                >
                                    Mettre à jour
                                </button>
                            )}
                        </div>
                        
                        {/* Bouton de suppression */}
                        {!isSubmitting && (
                            <button 
                                type="button" 
                                onClick={deleteRestaurant}
                                className="block w-full mt-2 bg-red-600 text-white rounded-sm px-4 py-2 font-bold hover:bg-red-700 hover:cursor-pointer"
                            >
                                Supprimer le restaurant
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditRestaurant;
