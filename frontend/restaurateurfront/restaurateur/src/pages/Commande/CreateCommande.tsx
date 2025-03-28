import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CreateCommande = () => {
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState("");
    const [menus, setMenus] = useState<any[]>([]);
    const [selectedMenus, setSelectedMenus] = useState<any[]>([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [idclient, setIdClient] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/restaurateurs");
                setRestaurants(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des restaurants", error);
            }
        };
        fetchRestaurants();
    }, []);

    useEffect(() => {
        if (selectedRestaurant) {
            const fetchMenus = async () => {
                try {
                    const response = await axios.get(`http://localhost:3006/api/menus?restaurant=${selectedRestaurant}`);
                    setMenus(response.data);
                } catch (error) {
                    console.error("Erreur lors de la récupération des menus", error);
                }
            };
            fetchMenus();
        } else {
            setMenus([]);
        }
    }, [selectedRestaurant]);

    const handleAddMenu = () => {
        setSelectedMenus([...selectedMenus, { menuId: "", quantity: 1 }]);
    };

    const handleMenuChange = (index: number, value: string) => {
        const updatedMenus = [...selectedMenus];
        updatedMenus[index].menuId = value;
        setSelectedMenus(updatedMenus);
        calculateTotalPrice(updatedMenus);
    };

    const handleQuantityChange = (index: number, value: number) => {
        const updatedMenus = [...selectedMenus];
        updatedMenus[index].quantity = value;
        setSelectedMenus(updatedMenus);
        calculateTotalPrice(updatedMenus);
    };

    const handleRemoveMenu = (index: number) => {
        const updatedMenus = [...selectedMenus];
        updatedMenus.splice(index, 1);
        setSelectedMenus(updatedMenus);
        calculateTotalPrice(updatedMenus);
    };

    const calculateTotalPrice = (selected: any[]) => {
        const total = selected.reduce((sum, item) => {
            const menu = menus.find(m => m._id === item.menuId);
            return menu ? sum + menu.price * item.quantity : sum;
        }, 0);
        setTotalAmount(total);
    };

    const saveOrder = async (e: any) => {
        e.preventDefault();

        if (!selectedRestaurant || selectedMenus.length === 0) {
            alert("Veuillez sélectionner un restaurant et au moins un menu");
            return;
        }

        try {
            setIsLoading(true);
            await axios.post("http://localhost:3003/api/commandes", {
                client: idclient,
                restaurant: selectedRestaurant,
                menus: selectedMenus.map(menu => ({ menuId: menu.menuId, quantity: menu.quantity })),
                totalAmount,
                status: "En attente"
            });

            toast.success("Commande créée avec succès");
            setIsLoading(false);
            navigate("/commande");
        } catch (error: any) {
            toast.error(error.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6">
            <h2 className="font-semibold text-2xl mb-4 text-center">Créer une Commande</h2>
            <form onSubmit={saveOrder}>
                <div className="space-y-2">
                    <div>
                        <label> Id client</label>
                        <input type="text" value={idclient} onChange={(e) => setIdClient(e.target.value)} className="w-full block border p-3 rounded" placeholder="id" />
                    </div>
                    <div>
                        <label>Restaurant</label>
                        <select value={selectedRestaurant} onChange={(e) => setSelectedRestaurant(e.target.value)} className="w-full block border p-3 rounded">
                            <option value="">Sélectionnez un restaurant</option>
                            {restaurants.map(restaurant => (
                                <option key={restaurant._id} value={restaurant._id}>{restaurant.restaurantName}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div>
                        {selectedMenus.length > 0 && <label className="my-4">Menus</label>}
                        {selectedMenus.map((selectedMenu, index) => (
                            <div className="flex items-center space-x-2" key={index}>
                                <select value={selectedMenu.menuId} onChange={(e) => handleMenuChange(index, e.target.value)} className="w-full block border p-3 rounded mt-2">
                                    <option value="">Sélectionnez un menu</option>
                                    {menus.map(menu => (
                                        <option key={menu._id} value={menu._id}>{menu.name} - {menu.price}€</option>
                                    ))}
                                </select>
                                <input type="number" min="1" value={selectedMenu.quantity} onChange={(e) => handleQuantityChange(index, Number(e.target.value))} className="w-16 border p-2 rounded text-center" />
                                <button type="button" onClick={() => handleRemoveMenu(index)} className="bg-red-500 text-white px-2 py-1 rounded">-</button>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddMenu} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">Ajouter un menu</button>
                    </div>
                    <div className="mt-4 font-bold">Total : {totalAmount}€</div>
                    <div>
                        {!isLoading && (
                            <button className="block w-full mt-6 bg-blue-700 text-white rounded px-4 py-2 font-bold hover:bg-blue-600">
                                Passer la commande
                            </button>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateCommande;