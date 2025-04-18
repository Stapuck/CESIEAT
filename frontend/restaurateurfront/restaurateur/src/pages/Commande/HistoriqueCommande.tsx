import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";


interface ICommande {
  _id: string;
  clientId_Zitadel: string;
  restaurantId: string;
  livreurId_Zitadel?: string;
  menuId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IClient {
  _id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
  clientId_Zitadel: string;
}

interface ILivreur {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleType: string;
  isAvailable: boolean;
  livreurId_Zitadel: string;
}

interface IRestaurateur {
  _id: string;
  managerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  phone: string;
}

interface IMenu {
  _id: string;
  name: string;
  price: number;
  articles: [];
  restaurateur: string;
}

const HistoriqueCommande = () => {
  const auth = useAuth();

  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [livreurs, setLivreur] = useState<ILivreur[]>([]);
  const [restaurantmanager, setRestaurantManager] =
    useState<IRestaurateur | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [menus, setMenus] = useState<IMenu[]>([]);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [filterByDate, setFilterByDate] = useState<boolean>(false);

  const [filterByAll, setFilterByAll] = useState<boolean>(true);
  const [filterByToday, setFilterByToday] = useState<boolean>(false);

  const getRestaurateurByManagerId = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/restaurateurs/manager/${auth.user?.profile.sub}`
      );

      if (Array.isArray(response.data) && response.data.length > 0) {
        setRestaurantManager(response.data[0]);
      } else {
        console.log("Aucun restaurant trouvé pour ce manager.");
        setRestaurantManager(null);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du restaurateur:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCommandesByRestaurateur = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/commandes/restaurateur/${restaurantmanager?._id}`
      );
      setCommandes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/clients");
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLivreurs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://cesieat.nathan-lorit.com/api/livreurs");
      setLivreur(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getMenusByRestaurateur = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/menus/restaurateur/${restaurantmanager?._id}`
      );
      setMenus(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurateurByManagerId();
    getClients();
    getLivreurs();
  }, []);

  useEffect(() => {
    if (restaurantmanager && restaurantmanager._id) {
      getCommandesByRestaurateur();
      getMenusByRestaurateur();
    }
  }, [restaurantmanager]);

  const filteredCommandes = commandes.filter((commande) => {
    const createdAt = new Date(commande.createdAt);
    const start = startDate ? new Date(startDate) : new Date(0);
    const end = endDate ? new Date(endDate) : new Date();

    return createdAt >= start && createdAt <= end;
  });

  const filteredTodayCommandes = commandes.filter((commande) => {
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

  const totalSum = ordersToDisplay.reduce(
    (sum, commande) => sum + commande.totalAmount,
    0
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const countMenuOrders = () => {
    const menuCount: { [key: string]: number } = {};
    commandes.forEach((commande) => {
      if (menuCount[commande.menuId]) {
        menuCount[commande.menuId]++;
      } else {
        menuCount[commande.menuId] = 1;
      }
    });
    return menuCount;
  };

  const sortedMenus = [...menus]
    .sort((a, b) => {
      const aCount = countMenuOrders()[a._id] || 0;
      const bCount = countMenuOrders()[b._id] || 0;
      return bCount - aCount;
    })
    .slice(0, 3);

  return (
    <div className="p-4 mt-25">
      <h1 className="text-2xl font-bold mb-4">
        Historique des Commandes ({ordersToDisplay.length})
      </h1>

      <div className="mb-4">
        <button
          className={`mr-4 px-4 py-2 ${
            filterByAll
              ? "bg-tertiary text-white rounded transform hover:scale-105 transition duration-300"
              : "transform hover:scale-105 transition duration-300 bg-gray-300 rounded"
          }`}
          onClick={() => {
            setFilterByAll(true);
            setFilterByDate(false);
            setFilterByToday(false);
          }}
        >
          Toutes les Commandes
        </button>
        <button
          className={`mr-4 px-4 py-2 ${
            filterByToday
              ? "bg-tertiary text-white rounded transform hover:scale-105 transition duration-300"
              : "bg-gray-300 rounded transform hover:scale-105 transition duration-300"
          }`}
          onClick={() => {
            setFilterByToday(true);
            setFilterByAll(false);
            setFilterByDate(false);
          }}
        >
          Commandes du Jour
        </button>
        <button
          className={`mr-4 px-4 py-2 ${
            filterByDate
              ? "bg-tertiary text-white rounded transform hover:scale-105 transition duration-300"
              : "bg-gray-300 rounded transform hover:scale-105 transition duration-300"
          }`}
          onClick={() => {
            setFilterByDate(true);
            setFilterByAll(false);
            setFilterByToday(false);
          }}
        >
          Filtrer par Date
        </button>
      </div>

      {filterByDate && (
        <div className="mb-4 p-2 rounded-t-md bg-transparent-background">
          <label className="mr-2">Start Date:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded bg-white p-2"
          />
          <label className="ml-4 mr-2">End Date:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded bg-white p-2"
          />
        </div>
      )}
      <div className="p-2 rounded-t-md bg-transparent-background">
        <label className="text-lg font-bold mb-4">
          Total des Montants des Commandes:{" "}
        </label>
        <input
          type="text"
          value={`${totalSum.toFixed(2)}€`}
          readOnly
          className="border border-gray-400 bg-white rounded p-2 mt-2 w-24"
        />
      </div>

      <table className="table-auto w-full border-collapse border bg-tertiary border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Numéro de commande</th>
            <th className="border border-gray-300 px-4 py-2">Client</th>
            <th className="border border-gray-300 px-4 py-2">Livreur</th>
            <th className="border border-gray-300 px-4 py-2">Menu</th>
            <th className="border border-gray-300 px-4 py-2">Montant Total</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            <th className="border border-gray-300 px-4 py-2">Créé le</th>
            <th className="border border-gray-300 px-4 py-2">Dernière MàJ</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={9} className="text-center py-4">
                Loading...
              </td>
            </tr>
          ) : (
            <>
              {ordersToDisplay.map((commande, index) => (
                <tr key={index} className="text-center border border-gray-300">
                  <td className="border border-gray-300 px-4 py-2">
                    #{commande._id.slice(-6)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {clients.find(
                      (client) =>
                        client.clientId_Zitadel === commande.clientId_Zitadel
                    )?.name || "Inconnu"}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {livreurs.find(
                      (livreur) =>
                        livreur.livreurId_Zitadel === commande.livreurId_Zitadel
                    )?.name || "N/A"}
                  </td>
                  {/* <td className="border border-gray-300 px-4 py-2"> revoir le model commande </td> */}
                  <td className="border border-gray-300 px-4 py-2">
                    {menus.find((menu) => menu._id === commande.menuId)?.name ||
                      "Inconnu"}
                  </td>
                  {/* <td className="border border-gray-300 px-4 py-2">{commande.menu}</td> */}
                  <td className="border border-gray-300 px-4 py-2">
                    {commande.totalAmount}€
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {commande.status}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(commande.createdAt)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {formatDate(commande.updatedAt)}
                  </td>
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>

      <div className="p-2 rounded-t-md bg-transparent-background mt-4">
        <h2 className="text-xl font-bold mb-4">
          Top 3 des Menus les Plus Commandés
        </h2>

        <table className="table-auto w-full border-collapse border bg-tertiary border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Nom du Menu</th>
              {/* <th className="border border-gray-300 px-4 py-2">Prix</th> */}
              <th className="border border-gray-300 px-4 py-2">
                Nombre de Commandes
              </th>
              {/* <th className="border border-gray-300 px-4 py-2">Nombre d'Articles</th> */}
            </tr>
          </thead>
          <tbody>
            {sortedMenus.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Aucun menu trouvé
                </td>
              </tr>
            ) : (
              sortedMenus.map((menu, index) => {
                const orderCount = countMenuOrders()[menu._id] || 0;
                return (
                  <tr
                    key={index}
                    className="text-center border border-gray-300"
                  >
                    <td className="border border-gray-300 px-4 py-2">
                      A#{menu._id.slice(-2)}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {menu.name}
                    </td>
                    {/* <td className="border border-gray-300 px-4 py-2">
                      {menu.price}€
                    </td> */}
                    <td className="border border-gray-300 px-4 py-2">
                      {orderCount}
                    </td>
                    {/* <td className="border border-gray-300 px-4 py-2">
                      {menu.articles.length}
                    </td> */}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoriqueCommande;
