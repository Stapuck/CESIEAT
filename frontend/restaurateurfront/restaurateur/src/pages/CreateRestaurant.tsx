// import { useState } from "react";
// import axios from "axios";

// const CreateRestaurant = () => {
//   const [formData, setFormData] = useState({
//     restaurantName: "",
//     address: "",
//     phone: "",
//     url: "",
//     position: "",
//     managerName: "",
//     email: "",
//     managerId: "",
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const [message, setMessage] = useState("");


//   const handleChange = (e : any) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e : any) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setMessage("");
//     try {
//       const response = await axios.post("http://localhost:3001/api/restaurateurs", formData);
//       setMessage("Restaurant créé avec succès !");
//       setFormData({
//         restaurantName: "",
//         address: "",
//         phone: "",
//         url: "",
//         position: "",
//         managerName: "",
//         email: "",
//         managerId: "",
//       });
//     } catch (error) {
//       console.error(error);
//       setMessage("Erreur lors de la création du restaurant.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
//       <h2 className="text-2xl font-bold mb-4">Créer un restaurant</h2>
//       {message && <p className="mb-4 text-center text-green-500">{message}</p>}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input type="text" name="restaurantName" placeholder="Nom du restaurant" className="w-full p-2 border rounded" onChange={handleChange} value={formData.restaurantName} required />
//         <input type="text" name="address" placeholder="Adresse" className="w-full p-2 border rounded" onChange={handleChange} value={formData.address} required />
//         <input type="tel" name="phone" placeholder="Téléphone" className="w-full p-2 border rounded" onChange={handleChange} value={formData.phone} required />
//         <input type="url" name="url" placeholder="Image URL" className="w-full p-2 border rounded" onChange={handleChange} value={formData.url} required />
//         <input type="text" name="position" placeholder="Position (lat, lng)" className="w-full p-2 border rounded" onChange={handleChange} value={formData.position} required />
//         <input type="text" name="managerName" placeholder="Nom du manager" className="w-full p-2 border rounded" onChange={handleChange} value={formData.managerName} required />
//         <input type="email" name="email" placeholder="Email du manager" className="w-full p-2 border rounded" onChange={handleChange} value={formData.email} required />
//         <input type="text" name="managerId" placeholder="ID du manager" className="w-full p-2 border rounded" onChange={handleChange} value={formData.managerId} required />
//         <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">
//           {isLoading ? "Création..." : "Créer le restaurant"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateRestaurant;


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
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [position, setPosition] = useState("");
    const [managerName, setManagerName] = useState(auth.user?.profile.given_name);
    const [email, setEmail] = useState(auth.user?.profile.email);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const saveRestaurant = async (e: any) => {
        e.preventDefault();

        if (!restaurantName || !address || !phone || !url || !position || !managerName || !email || !name || !password) {
            alert("Veuillez remplir tous les champs");
            return;
            //todo toastify 
        }

        // Convertir position en tableau de nombres
        const formattedPosition = position.split(",").map(coord => parseFloat(coord.trim()));

        if (formattedPosition.length !== 2 || isNaN(formattedPosition[0]) || isNaN(formattedPosition[1])) {
            alert("Veuillez entrer une position valide (format: lat, lng)");
            return;
            //todo toastify 

        }      

        try {
            setIsLoading(true);
            await axios.post("http://localhost:3001/api/restaurateurs", {
                restaurantName,
                address,
                phone,
                password, 
                url,
                position : formattedPosition,
                managerName,
                name,
                email,
                managerId: auth.user?.profile.sub
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
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 text-center">Créer un restaurant</h2>
            <form onSubmit={saveRestaurant}>
                <div className="space-y-2">
                    <div>
                        <label>Nom du restaurant</label>
                        <input type="text" value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} className="w-full block border p-3 rounded" placeholder="Nom du restaurant" />
                    </div>
                    <div>
                        <label>Nom </label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full block border p-3 rounded" placeholder="Nom" />
                    </div>
                    <div>
                        <label>Password </label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full block border p-3 rounded" placeholder="password" />
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