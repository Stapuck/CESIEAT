import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";


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
  const auth = useAuth();

  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [livreurs, setLivreur] = useState<ILivreur[]>([]);
  const [restaurateurs, setRestaurateur] = useState<IRestaurateur[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filterByDate, setFilterByDate] = useState<boolean>(false);  

  const [filterByAll, setFilterByAll] = useState<boolean>(true); 
  const [filterByToday, setFilterByToday] = useState<boolean>(false); 



  const getCommandesByRestaurateur = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost:3003/api/commandes`);
      // const response = await axios.get(`http://localhost:8080/api/commandes/restaurateur/${auth.user?.profile.sub}`);
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
    // getCommandes();
    getCommandesByRestaurateur();
    getClients();
    getRestaurateurs();
    getLivreurs();
  }, []);

  const filteredCommandes = commandes.filter(commande => {
    const createdAt = new Date(commande.createdAt);
    const start = startDate ? new Date(startDate) : new Date(0); 
    const end = endDate ? new Date(endDate) : new Date();

    return createdAt >= start && createdAt <= end;
  });

  const filteredTodayCommandes = commandes.filter(commande => {
    const createdAt = new Date(commande.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfDay = today;
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return createdAt >= startOfDay && createdAt <= endOfDay;
  });

  let ordersToDisplay: ICommande[] = [];
  if (filterByAll) {
    ordersToDisplay = commandes;
  } else if (filterByToday) {
    ordersToDisplay = filteredTodayCommandes;
  } else if (filterByDate) {
    ordersToDisplay = filteredCommandes;
  }

  const totalSum = ordersToDisplay.reduce((sum, commande) => sum + commande.totalAmount, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historique des Commandes ({ordersToDisplay.length})</h1>

      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 ${filterByAll ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => { setFilterByAll(true); setFilterByDate(false); setFilterByToday(false); }}
        >
          Toutes les Commandes
        </button>
        <button
          className={`mr-4 px-4 py-2 ${filterByToday ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => { setFilterByToday(true); setFilterByAll(false); setFilterByDate(false); }}
        >
          Commandes du Jour
        </button>
        <button
          className={`mr-4 px-4 py-2 ${filterByDate ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          onClick={() => { setFilterByDate(true); setFilterByAll(false); setFilterByToday(false); }}
        >
          Filtrer par Date
        </button>
      </div>

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
      <div className="mt-4 mb-4">
       <label className="font-bold">Total des Montants des Commandes: </label>
       <input
          type="text"
          value={`${totalSum.toFixed(2)}€`}
          readOnly
          className="border border-gray-400 p-2 mt-2 rounded-lg w-24"
        />
      </div>

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
                    {/* {restaurateurs.find(restaurateur => restaurateur._id === commande.restaurant)?.restaurantName || "Inconnu"} */}
                    {commande.restaurant}
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
    </div>
  );
};

export default HistoriqueCommande;
