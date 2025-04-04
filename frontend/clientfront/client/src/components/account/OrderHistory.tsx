import { useEffect, useState } from "react";
import axios from "axios";
import QRCodeGenerator from "./QRCodeGenerator";
import { useAuth } from "react-oidc-context";
import Swal from "sweetalert2"; // Ajout de l'import SweetAlert2

interface MenuItem {
  menuItem: string;
  quantity: number;
  _id: string;
}

interface Restaurant {
  _id: string;
  restaurantName: string;
  // autres champs si nécessaire
}

interface Livreur {
  _id: string;
  name: string;
  // autres champs si nécessaire
}

interface Order {
  _id: string;
  client: string;
  restaurant: string;
  livreur: string | null;
  items?: MenuItem[];
  menu?: string;
  status?: string;
  montant?: number;
  date?: string;
  adresseLivraison?: string;
}

const OrderHistory = () => {
  const { user } = useAuth();
  const clientId_Zitadel = user?.profile.sub;

  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<{ [id: string]: Restaurant }>(
    {}
  );
  const [livreurs, setLivreurs] = useState<{ [id: string]: Livreur }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(
    null
  );
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Fonction pour formater la date
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

  // Fonction pour déterminer la classe CSS du statut
  const getStatusClass = (status?: string) => {
    console.log("Statut de la commande:", status);
    switch (status) {
      case "Préparation":
        return "bg-yellow-100 text-yellow-800";
      case "En livraison":
        return "bg-blue-100 text-blue-800";
      case "Livrée":
        return "bg-green-100 text-green-800";
      case "Annulée":
        return "bg-red-100 text-red-800";
      default:
        return "bg-orange-100 text-black-800";
    }
  };

  // Fonction pour afficher le texte du statut
  const getStatusText = (status?: string) => {
    console.log("Statut de la commande:", status);
    switch (status) {
      case "Préparation":
        return "En préparation";
      case "En livraison":
        return "En livraison";
      case "Livrée":
        return "Livrée";
      case "Annulée":
        return "Annulée";
      default:
        return "En attente";
    }
  };

  // Fonction pour récupérer les détails d'un restaurant
  const fetchRestaurantDetails = async (restaurantId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/restaurateurs/${restaurantId}`
      );
      setRestaurants((prev) => ({ ...prev, [restaurantId]: response.data }));
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des détails du restaurant ${restaurantId}:`,
        err
      );
    }
  };

  // Fonction pour récupérer les détails d'un livreur
  const fetchLivreurDetails = async (livreurId: string) => {
    if (!livreurId) return;
    try {
      const response = await axios.get(
        `http://localhost:8080/api/livreurs/byZitadelId/${livreurId}`
      );
      setLivreurs((prev) => ({ ...prev, [livreurId]: response.data }));
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des détails du livreur ${livreurId}:`,
        err
      );
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      // Vérification si l'utilisateur est connecté
      if (!clientId_Zitadel) {
        setError("Vous devez être connecté pour voir vos commandes.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8080/api/commandes/client/${clientId_Zitadel}`
        );
        const ordersData = response.data;

        // Map the API response to match our Order interface
        const mappedOrders = ordersData.map((order: any) => ({
          _id: order._id,
          client: order.clientId_Zitadel,
          restaurant: order.restaurantId,
          livreur: order.livreurId_Zitadel || null,
          menu: order.menuId,
          status: order.status,
          montant: order.totalAmount,
          date: order.createdAt,
          // Add other fields as needed
        }));

        console.log("Commandes récupérées:", mappedOrders);

        setOrders(mappedOrders);

        // Récupérer les détails des restaurants et des livreurs
        const uniqueRestaurantIds = [
          ...new Set(mappedOrders.map((order: Order) => order.restaurant)),
        ];
        const uniqueLivreurIds = [
          ...new Set(mappedOrders.map((order: Order) => order.livreur)),
        ];

        // Récupérer les détails pour chaque restaurant et livreur unique
        for (const restaurantId of uniqueRestaurantIds as string[]) {
          fetchRestaurantDetails(restaurantId);
        }

        for (const livreurId of uniqueLivreurIds as string[]) {
          fetchLivreurDetails(livreurId);
        }

        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setError(
          "Aucunne commande trouvée."
        );
        setLoading(false);
      }
    };

    fetchOrders();
  }, [clientId_Zitadel]);

  // Fonction pour annuler une commande avec SweetAlert2
  const cancelOrder = async (orderId: string) => {
    // Utilisation de SweetAlert2 pour la confirmation
    const result = await Swal.fire({
      title: "Êtes-vous sûr?",
      text: "Voulez-vous vraiment annuler cette commande?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Oui, annuler",
      cancelButtonText: "Non, conserver",
    });

    // Si l'utilisateur n'a pas confirmé, on arrête
    if (!result.isConfirmed) return;

    setCancellingOrderId(orderId);
    setCancelError(null);

    try {
      await axios.delete(`http://localhost:8080/api/commandes/${orderId}`);

      // Mettre à jour la commande localement
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: "Annulée" } : order
        )
      );

      // Notification de succès
      Swal.fire({
        title: "Commande annulée!",
        text: "Votre commande a été annulée avec succès.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Erreur lors de l'annulation de la commande:", err);

      // Notification d'erreur
      Swal.fire({
        title: "Erreur",
        text: "Impossible d'annuler la commande. Veuillez réessayer plus tard.",
        icon: "error",
        confirmButtonText: "OK",
      });

      setCancelError(
        "Impossible d'annuler la commande. Veuillez réessayer plus tard."
      );
    } finally {
      setCancellingOrderId(null);
    }
  };

  // Détermine si une commande peut être annulée
  const canCancelOrder = (status?: string) => {
    // On peut annuler seulement les commandes en attente ou en préparation
    return !status || status === "Préparation" || status === "En attente";
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Vos Commandes
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>
      )}

      {cancelError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {cancelError}
        </div>
      )}

      {!loading &&
        !error &&
        (orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li
                key={order._id}
                className="py-4 flex flex-col hover:bg-gray-50 rounded-lg p-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-600">
                    Commande #{order._id.substr(-6)}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                      order.status
                    )}`}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>

                {order.date && (
                  <div className="text-sm text-gray-500 mb-2">
                    {formatDate(order.date)}
                  </div>
                )}

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Restaurant:{" "}
                    {restaurants[order.restaurant]?.restaurantName || "Chargement..."}
                  </span>
                  <span>
                    Livreur:{" "}
                    {order.livreur
                      ? livreurs[order.livreur]?.name || "Chargement..."
                      : "Non assigné"}
                  </span>
                </div>

                <QRCodeGenerator commandeId={order._id} />

                {order.items && order.items.length > 0 && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-gray-700">Détails:</p>
                    <ul className="list-disc pl-5">
                      {order.items.map((item) => (
                        <li key={item._id} className="text-gray-600">
                          {item.menuItem} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {order.adresseLivraison && (
                  <div className="mt-2 text-sm text-gray-600">
                    <p className="font-medium text-gray-700">
                      Adresse de livraison:
                    </p>
                    <p>{order.adresseLivraison}</p>
                  </div>
                )}

                <div className="mt-3 flex justify-between items-center">
                  {canCancelOrder(order.status) && (
                    <button
                      onClick={() => cancelOrder(order._id)}
                      disabled={cancellingOrderId === order._id}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        cancellingOrderId === order._id
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }`}
                    >
                      {cancellingOrderId === order._id
                        ? "Annulation..."
                        : "Annuler la commande"}
                    </button>
                  )}

                  {order.montant && (
                    <div className="self-end">
                      <span className="font-bold">{order.montant}€</span>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Aucune commande trouvée</p>
            <p className="text-sm text-gray-400">
              Vos commandes apparaîtront ici
            </p>
          </div>
        ))}
    </section>
  );
};

export default OrderHistory;
