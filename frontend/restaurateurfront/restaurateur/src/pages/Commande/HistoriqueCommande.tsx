import axios from "axios";
import { useEffect, useState } from "react";

interface ICommande {
  _id: string;
  client: number;
  restaurant: number;
  livreur?: number;
  menu: [];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IClient {
  _id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
}

interface ILivreur {
  _id: number;
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleType: string;
  isAvailable: boolean;
}

interface IRestaurateur {
  _id: number;
  managerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  phone: string;
}

const HistoriqueCommande = () => {
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [livreurs, setLivreur] = useState<ILivreur[]>([]);
  const [restaurateurs, setRestaurateur] = useState<IRestaurateur[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterByDate, setFilterByDate] = useState<boolean>(false);  // State to toggle between all orders and date filter

  const getCommandes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/commandes");
      setCommandes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/clients");
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurateurs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/restaurateurs");
      setRestaurateur(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLivreurs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/livreurs");
      setLivreur(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommandes();
    getClients();
    getRestaurateurs();
    getLivreurs();
  }, []);

  // Filter commandes based on date range
  const filteredCommandes = commandes.filter(commande => {
    const createdAt = new Date(commande.createdAt);
    const start = startDate ? new Date(startDate) : new Date(0); // If no start date, use very old date
    const end = endDate ? new Date(endDate) : new Date(); // If no end date, use the current date

    return createdAt >= start && createdAt <= end;
  });

  // Determine the orders to show based on filterByDate state
  const ordersToDisplay = filterByDate ? filteredCommandes : commandes;

  // Calculate the sum of total amounts for displayed orders
  const totalSum = ordersToDisplay.reduce((sum, commande) => sum + commande.totalAmount, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historique des Commandes ({ordersToDisplay.length})</h1>

      {/* Toggle Filter Mode (All Orders or Date Filter) */}
      <div className="mb-4">
        <label className="mr-2">Filter By Date:</label>
        <input
          type="checkbox"
          checked={filterByDate}
          onChange={() => setFilterByDate(prev => !prev)}
          className="mr-2"
        />
        <span>{filterByDate ? 'Enabled' : 'Disabled'}</span>
      </div>

      {/* Date Filter Section (only visible if filterByDate is true) */}
      {filterByDate && (
        <div className="mb-4">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 p-2"
          />
          <label className="ml-4 mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 p-2"
          />
        </div>
      )}

      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">id commande</th>
            <th className="border border-gray-300 px-4 py-2">Client</th>
            <th className="border border-gray-300 px-4 py-2">Restaurant</th>
            <th className="border border-gray-300 px-4 py-2">Livreur</th>
            <th className="border border-gray-300 px-4 py-2">Items</th>
            <th className="border border-gray-300 px-4 py-2">Montant Total</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            <th className="border border-gray-300 px-4 py-2">créé le</th>
            <th className="border border-gray-300 px-4 py-2">last update</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="text-center py-4">Loading...</td>
            </tr>
          ) : (
            <>
              {ordersToDisplay.map((commande, index) => (
                <tr key={index} className="text-center border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">{commande._id}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {clients.find(client => client._id === commande.client)?.name || "Inconnu"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {restaurateurs.find(restaurateur => restaurateur._id === commande.restaurant)?.restaurantName || "Inconnu"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {livreurs.find(livreur => livreur._id === commande.livreur)?.name || "N/A"}
                  </td>
                  <td className="border border-gray-300 px-4 py-2"> revoir le model commande </td>
                  <td className="border border-gray-300 px-4 py-2">{commande.totalAmount}€</td>
                  <td className="border border-gray-300 px-4 py-2">{commande.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(commande.createdAt).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(commande.updatedAt).toLocaleString()}</td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      {/* Display the sum of the total amounts */}
      <div className="mt-4">
        <label className="font-bold">Total des Montants des Commandes: </label>
        <input
          type="text"
          value={`${totalSum}€`}
          readOnly
          className="border border-gray-300 p-2 mt-2"
        />
      </div>
    </div>
  );
};

export default HistoriqueCommande;
