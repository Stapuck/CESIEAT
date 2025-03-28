import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icône personnalisée pour le marqueur
const customIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    shadowSize: [41, 41],
});

const CreateRestaurant = () => {
    const [name, setName] = useState("");
    const [position, setPosition] = useState<[number, number]>([46.603354, 1.888334]); // Position par défaut : France
    const [managerName, setManagerName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [restaurantName, setRestaurantName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [url, setUrl] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const saveRestaurant = async (e: any) => {
        e.preventDefault();

        if (!name || !position || !managerName || !email || !password || !restaurantName || !address || !phone || !url) {
            toast.error("Please fill all input fields");
            return;
        }

        try {
            setIsLoading(true);
            const response = await axios.post("http://localhost:3001/api/restaurateurs", {
                name,
                position,
                managerName,
                email,
                password,
                restaurantName,
                address,
                phone,
                url,
            });

            toast.success(`Restaurant "${response.data.restaurantName}" created successfully`);
            setIsLoading(false);
            navigate("/");
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
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
            toast.info(`Address updated: ${fetchedAddress}`);
        } catch (error) {
            console.error("Erreur lors de la récupération de l'adresse :", error);
            toast.error("Unable to fetch address from coordinates");
        }
    };

    // Composant pour gérer les clics sur la carte
    const LocationMarker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPosition([lat, lng]);
                fetchAddressFromCoordinates(lat, lng); // Récupérer l'adresse
            },
        });

        return position === null ? null : (
            <Marker position={position} icon={customIcon}></Marker>
        );
    };

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 block text-center">
                Create a Restaurant
            </h2>
            <form onSubmit={saveRestaurant}>
                <div className="space-y-2">
                    <div>
                        <label>Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Name"
                        />
                    </div>
                    <div>
                        <label>Manager Name</label>
                        <input
                            type="text"
                            value={managerName}
                            onChange={(e) => setManagerName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Manager Name"
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Email"
                        />
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Password"
                        />
                    </div>
                    <div>
                        <label>Restaurant Name</label>
                        <input
                            type="text"
                            value={restaurantName}
                            onChange={(e) => setRestaurantName(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Restaurant Name"
                        />
                    </div>
                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Address"
                        />
                    </div>

                    <div>
                        <label>Position (Select on Map)</label>
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
                        <label>Phone</label>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter Phone"
                        />
                    </div>
                    <div>
                        <label>URL</label>
                        <input
                            type="text"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="w-full block border p-3 text-slate-600 rounded focus:outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400"
                            placeholder="Enter URL"
                        />
                    </div>

                    <div>
                        {!isLoading && (
                            <button className="block w-full mt-6 bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer">
                                Save
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateRestaurant;
