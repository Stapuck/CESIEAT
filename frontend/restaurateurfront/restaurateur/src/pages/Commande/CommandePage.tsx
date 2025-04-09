import axios from "axios";
import { useEffect, useState } from "react";
import CommandeCard from "./CommandeCard";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Hide from "../../assets/icons/chevron.up.svg";
import Show from "../../assets/icons/chevron.down.svg";

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

interface IRestaurateur {
  _id: string;
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  position: [number, number];
  url_image: string;
  managerId: string;
}
const CommandesPage = () => {
  const auth = useAuth();
  const [restaurantmanager, setRestaurantManager] =
    useState<IRestaurateur | null>(null);

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

  useEffect(() => {
    getRestaurateurByManagerId();
  }, []);

  const intervalMs = 3000; // Valeur fixe au lieu du state inutilisé

  const { status, data, error } = useQuery({
    queryKey: ["todos", restaurantmanager?._id], // Ajout de l'ID comme dépendance

    queryFn: async (): Promise<Array<ICommande>> => {
      if (!restaurantmanager?._id) return []; // Évite une requête invalide
      const response = await fetch(
        `https://cesieat.nathan-lorit.com/api/commandes/restaurateur/${restaurantmanager._id}`
      );

      return await response.json();
    },
    enabled: !!restaurantmanager?._id, // Exécute la requête seulement si l'ID est défini
    refetchInterval: intervalMs,
  });

  const [commandes, setCommandes] = useState<ICommande[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [showNouvellesCommandes, setShowNouvellesCommandes] = useState(true);
  const [showEnPreparationCommandes, setShowEnPreparationCommandes] =
    useState(true);
  const [showEnAttenteDeRecupCommandes, setShowEnAttenteDeRecupCommandes] =
    useState(true);
  const [showEnLivraisonCommandes, setShowEnLivraisonCommandes] =
    useState(true);
  const [showLivreeCommande, setShowLivreeCommande] = useState(true);
  const [showAnnuleeCommande, setShowAnnuleeCommande] = useState(true);

  // if (status === "pending") return <h1>Loading...</h1>;
  // if (status === "error") return <span>Error: {error.message}</span>;

  if (status === "pending") return <h1>Loading...</h1>;
  if (status === "error") return <span>Error: {error.message}</span>;

  if (!data || data.length === 0) {
    return (
      <div className="min-h-screen bg-transparent-background mt-25 mx-3 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Gestion des Commandes
          </h1>
        </div>
        <p className="text-gray-600 text-lg">Aucune commande pour le moment.</p>
      </div>
    );
  }

  // Filtrer les commandes par statut
  const nouvellesCommandes = data.filter(
    (commande) => commande.status === "En attente"
  );
  const enPreparationCommandes = data.filter(
    (commande) => commande.status === "Préparation"
  );
  const enAttenteDeRecupCommandes = data.filter(
    (commande) => commande.status === "Prêt"
  );
  const enLivraisonCommandes = data.filter(
    (commande) => commande.status === "En livraison"
  );
  const LivreeCommande = data.filter(
    (commande) => commande.status === "Livrée"
  );
  const AnnuleeCommande = data.filter(
    (commande) => commande.status === "Annulée"
  );

  const handleValidation = (commande: ICommande) => {
    console.log("Commande validée:", commande._id);

    setCommandes((prevCommandes) =>
      prevCommandes.map((cmd) =>
        cmd._id === commande._id ? { ...cmd, status: "Préparation" } : cmd
      )
    );

    axios
      .put(`https://cesieat.nathan-lorit.com/api/commandes/${commande._id}`, {
        status: "Préparation",
      })
      .catch((error) => console.log("Erreur de mise à jour:", error));
  };

  const handlePreparation = (commande: ICommande) => {
    console.log("Commande marquée comme prête:", commande._id);

    // Mise à jour de l'état des commandes
    setCommandes((prevCommandes) =>
      prevCommandes.map((cmd) =>
        cmd._id === commande._id ? { ...cmd, status: "Prêt" } : cmd
      )
    );

    axios
      .put(`https://cesieat.nathan-lorit.com/api/commandes/${commande._id}`, {
        status: "Prêt",
      })
      .catch((error) => console.log("Erreur de mise à jour:", error));
  };

  const handleLivraison = async (commande: ICommande, codeLivreur: string) => {
    try {
      console.log("Commande en livraison:", commande._id);
      console.log("Code livreur :", codeLivreur);

      // Récupération du livreur
      const response = await axios.get(
        `https://cesieat.nathan-lorit.com/api/livreurs/codelivreur/${codeLivreur}`
      );
      const livreur = response.data;

      if (!livreur || !livreur._id) {
        console.error("Livreur non trouvé");
        alert("Livreur non trouvé !");
        return;
      }

      // Mise à jour de l'état local des commandes
      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd._id === commande._id
            ? { ...cmd, status: "En livraison", livreur: livreur._id }
            : cmd
        )
      );

      // Mise à jour de la commande côté backend
      await axios.put(
        `https://cesieat.nathan-lorit.com/api/commandes/${commande._id}`,
        {
          status: "En livraison",
          livreur: livreur._id, // Ajout de l'ID du livreur
        }
      );
    } catch (error) {
      toast.error("Erreur lors de la mise à jour de la commande.");
    }
  };

  const handleAnnulation = async (commande: ICommande) => {
    const result = await Swal.fire({
      title: "Voulez-vous vraiment Annuler la commande ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, annuler !",
    });

    if (result.isConfirmed) {
      console.log("Commande Annulée", commande._id);

      setCommandes((prevCommandes) =>
        prevCommandes.map((cmd) =>
          cmd._id === commande._id ? { ...cmd, status: "Annulée" } : cmd
        )
      );

      axios
        .put(`https://cesieat.nathan-lorit.com/api/commandes/${commande._id}`, {
          status: "Annulée",
        })
        .catch((error) => console.log("Erreur de mise à jour:", error));
    }
  };

  return (
    <div className="min-h-screen bg-transparent-background mt-25 mx-3 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Commandes
        </h1>
      </div>

      {commandes ? (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-6">
            {/* Nouvelle Commande */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Nouvelles Commandes ({nouvellesCommandes.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() =>
                    setShowNouvellesCommandes(!showNouvellesCommandes)
                  }
                >
                  {showNouvellesCommandes ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showNouvellesCommandes && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : nouvellesCommandes.length === 0 ? (
                    <p className="text-gray-600">
                      Pas de nouvelles commandes pour le moment.
                    </p>
                  ) : (
                    nouvellesCommandes.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Commande en préparation */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Commandes en Préparation ({enPreparationCommandes.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() =>
                    setShowEnPreparationCommandes(!showEnPreparationCommandes)
                  }
                >
                  {showEnPreparationCommandes ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showEnPreparationCommandes && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : enPreparationCommandes.length === 0 ? (
                    <p className="text-gray-600">
                      Aucune commande en préparation pour l'instant.
                    </p>
                  ) : (
                    enPreparationCommandes.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Commande en attente de récupération */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Commandes en Attente de Récupération (
                  {enAttenteDeRecupCommandes.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() =>
                    setShowEnAttenteDeRecupCommandes(
                      !showEnAttenteDeRecupCommandes
                    )
                  }
                >
                  {showEnAttenteDeRecupCommandes ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showEnAttenteDeRecupCommandes && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : enAttenteDeRecupCommandes.length === 0 ? (
                    <p className="text-gray-600">
                      Aucune commande prête pour le moment.
                    </p>
                  ) : (
                    enAttenteDeRecupCommandes.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Commande en Livraison */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  En livraison ({enLivraisonCommandes.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() =>
                    setShowEnLivraisonCommandes(!showEnLivraisonCommandes)
                  }
                >
                  {showEnLivraisonCommandes ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showEnLivraisonCommandes && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : enLivraisonCommandes.length === 0 ? (
                    <p className="text-gray-600">
                      Pas de commandes en livraison pour le moment.
                    </p>
                  ) : (
                    enLivraisonCommandes.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Commande livrée */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Livrée ({LivreeCommande.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() => setShowLivreeCommande(!showLivreeCommande)}
                >
                  {showLivreeCommande ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showLivreeCommande && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : LivreeCommande.length === 0 ? (
                    <p className="text-gray-600">
                      Pas de commandes livrées pour le moment.
                    </p>
                  ) : (
                    LivreeCommande.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
            {/* Commande Annulée */}
            <div className="bg-white p-4 rounded shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Annulée ({AnnuleeCommande.length})
                </h2>
                <button
                  className="text-sm text-blue-500"
                  onClick={() => setShowAnnuleeCommande(!showAnnuleeCommande)}
                >
                  {showAnnuleeCommande ? (
                    <>
                      {" "}
                      <img src={Hide} alt="Hide" className="w-4" />
                    </>
                  ) : (
                    <>
                      {" "}
                      <img src={Show} alt="Show" className="w-4" />
                    </>
                  )}
                </button>
              </div>
              {showLivreeCommande && (
                <div className="bg-gray-200 p-4 rounded mb-4">
                  {isLoading ? (
                    "Loading"
                  ) : AnnuleeCommande.length === 0 ? (
                    <p className="text-gray-600">Pas de commandes anulées.</p>
                  ) : (
                    AnnuleeCommande.map((commande) => (
                      <CommandeCard
                        key={commande._id}
                        commande={commande}
                        onValidate={handleValidation}
                        onPrepare={handlePreparation}
                        onDeliver={handleLivraison}
                        onCancel={handleAnnulation}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <> pas de commande</>
      )}
    </div>
  );
};

export default CommandesPage;
