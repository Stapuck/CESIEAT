import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CommandeCard from "./CommandeCard";

interface ICommande {
  _id: string;
  client: string;
  restaurant: string;
  livreur?: string;
  items: { menuItem: []; name: string; price: number; }[];
  totalAmount: number;
  status: string;
  createdAt : string;
}

interface ILivreur {
  _id : string; 
  name: string;
  email: string;
  password: string;
  phone: string;
  vehicleType: string;
  isAvailable: boolean;
  codeLivreur: string;  
}

const CommandesPage = () => {
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [livreur, setLivreur] = useState<ILivreur>();
  const [isLoading, setIsLoading] = useState(false);


  const [showNouvellesCommandes, setShowNouvellesCommandes] = useState(true);
  const [showEnPreparationCommandes, setShowEnPreparationCommandes] = useState(true);
  const [showEnAttenteDeRecupCommandes, setShowEnAttenteDeRecupCommandes] = useState(true);
  const [showEnLivraisonCommandes, setShowEnLivraisonCommandes] = useState(true);
  const [showLivreeCommande, setShowLivreeCommande] = useState(true);
  const [showAnnuleeCommande, setShowAnnuleeCommande] = useState(true);

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

  useEffect(() => {
    getCommandes();
  }, []);

  // Filtrer les commandes par statut
  const nouvellesCommandes = commandes.filter((commande) => commande.status === "En attente");
  const enPreparationCommandes = commandes.filter((commande) => commande.status === "Préparation");
  const enAttenteDeRecupCommandes = commandes.filter((commande) => commande.status === "Prêt");
  const enLivraisonCommandes = commandes.filter((commande) => commande.status === "En livraison");
  const LivreeCommande = commandes.filter((commande) => commande.status === "Livrée");
  const AnnuleeCommande = commandes.filter((commande) => commande.status === "Annulée");

  const handleValidation = (commande: ICommande) => {
    console.log("Commande validée:", commande._id);
  
    setCommandes((prevCommandes) =>
      prevCommandes.map((cmd) =>
        cmd._id === commande._id ? { ...cmd, status: "Préparation" } : cmd
      )
    );
  
    axios
      .put(`http://localhost:8080/api/commandes/${commande._id}`, { status: "Préparation" })
      .catch((error) => console.log("Erreur de mise à jour:", error));
  };
  
  
  const handlePreparation = (commande : ICommande) => {
    console.log("Commande marquée comme prête:", commande._id);
  
    // Mise à jour de l'état des commandes
    setCommandes((prevCommandes) =>
      prevCommandes.map((cmd) =>
        cmd._id === commande._id ? { ...cmd, status: "Prêt" } : cmd
      )
    );
  
    axios
      .put(`http://localhost:8080/api/commandes/${commande._id}`, { status: "Prêt" })
      .catch((error) => console.log("Erreur de mise à jour:", error));
  };
  
  // const handleLivraison = (commande : ICommande) => {
  //   // Logique pour marquer la commande comme livrée
  //   console.log("Commande en livraison:", commande._id);
  //   console.log("livreur : ", commande.livreur)


  //   // Mise à jour de l'état des commandes
  //   setCommandes((prevCommandes) =>
  //     prevCommandes.map((cmd) =>
  //       cmd._id === commande._id ? { ...cmd, status: "En livraison" } : cmd
  //     )
  //   );
  
  //   axios
  //     .put(`http://localhost:8080/api/commandes/${commande._id}`, { status: "En livraison"})
  //     .catch((error) => console.log("Erreur de mise à jour:", error));

  // };



  const rechercherLivreur = async (codeLivreur : string) => {

    try {
      const response = await axios.get(`http://localhost:3004/api/livreurs/codelivreur/${codeLivreur}`);
      setLivreur(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la recherche du livreur :", error);
      alert("Livreur non trouvé");
      // toastify
    }
  };
  

  const handleLivraison = (commande : ICommande, codelivreur : string) => {
    // Logique pour marquer la commande comme livrée
    console.log("Commande en livraison:", commande._id);
    // console.log("livreur : ", commande.livreur);
    // console.log("code livreur : ", codelivreur);

    rechercherLivreur(codelivreur);



    // console.log(livreur);
    // console.log(commandes);


  



  };
  

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
        <Link to='/historique' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Historique des commandes
        </Link>
      </div>

      <Link to='/create-commande' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Create (provisoir)
        </Link>

      <div className="grid grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-6">
        {/* Nouvelle Commande */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouvelles Commandes ({nouvellesCommandes.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowNouvellesCommandes(!showNouvellesCommandes)}
            >
              {showNouvellesCommandes ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showNouvellesCommandes && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                nouvellesCommandes.length === 0 ? (
                  <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
                ) : (
                  nouvellesCommandes.map((commande) => (
                    <CommandeCard
                      key={commande._id}
                      commande={commande}
                      onValidate={handleValidation}
                      onPrepare={handlePreparation}
                      onDeliver={handleLivraison}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>


        {/* Commande en préparation */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Préparation ({enPreparationCommandes.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowEnPreparationCommandes(!showEnPreparationCommandes)}
            >
              {showEnPreparationCommandes ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showEnPreparationCommandes && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                enPreparationCommandes.length === 0 ? (
                  <p className="text-gray-600">Aucune commande en préparation pour l'instant.</p>
                ) : (
                  enPreparationCommandes.map((commande) => (
                    <CommandeCard
                      key={commande._id}
                      commande={commande}
                      onValidate={handleValidation}
                      onPrepare={handlePreparation}
                      onDeliver={handleLivraison}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>

        {/* Commande en attente de récupération */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Attente de Récupération ({enAttenteDeRecupCommandes.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowEnAttenteDeRecupCommandes(!showEnAttenteDeRecupCommandes)}
            >
              {showEnAttenteDeRecupCommandes ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showEnAttenteDeRecupCommandes && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                enAttenteDeRecupCommandes.length === 0 ? (
                  <p className="text-gray-600">Aucune commande prête pour le moment.</p>
                ) : (
                  enAttenteDeRecupCommandes.map((commande) => (
                    <CommandeCard
                    key={commande._id}
                    commande={commande}
                    onValidate={handleValidation}
                    onPrepare={handlePreparation}
                    onDeliver={handleLivraison}
                  />
                  ))
                )
              )}
            </div>
          )}
        </div>

        {/* Commande en Livraison */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">En livraison ({enLivraisonCommandes.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowEnLivraisonCommandes(!showEnLivraisonCommandes)}
            >
              {showEnLivraisonCommandes ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showEnLivraisonCommandes && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                enLivraisonCommandes.length === 0 ? (
                  <p className="text-gray-600">Pas de commandes en livraison pour le moment.</p>
                ) : (
                  enLivraisonCommandes.map((commande) => (
                    <CommandeCard
                      key={commande._id}
                      commande={commande}
                      onValidate={handleValidation}
                      onPrepare={handlePreparation}
                      onDeliver={handleLivraison}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>

        {/* Commande livrée */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Livrée ({LivreeCommande.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowLivreeCommande(!showLivreeCommande)}
            >
              {showLivreeCommande ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showLivreeCommande && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                LivreeCommande.length === 0 ? (
                  <p className="text-gray-600">Pas de commandes livrées pour le moment.</p>
                ) : (
                  LivreeCommande.map((commande) => (
                    <CommandeCard
                      key={commande._id}
                      commande={commande}
                      onValidate={handleValidation}
                      onPrepare={handlePreparation}
                      onDeliver={handleLivraison}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>
        {/* Commande Annulée */}
        <div className="bg-white p-4 rounded shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Annulée ({AnnuleeCommande.length})</h2>
            <button
              className="text-sm text-blue-500"
              onClick={() => setShowAnnuleeCommande(!showAnnuleeCommande)}
            >
              {showLivreeCommande ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          {showLivreeCommande && (
            <div className="bg-gray-200 p-4 rounded mb-4">
              {isLoading ? ('Loading') : (
                AnnuleeCommande.length === 0 ? (
                  <p className="text-gray-600">Pas de commandes anulées.</p>
                ) : (
                  AnnuleeCommande.map((commande) => (
                    <CommandeCard
                      key={commande._id}
                      commande={commande}
                      onValidate={handleValidation}
                      onPrepare={handlePreparation}
                      onDeliver={handleLivraison}
                    />
                  ))
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommandesPage;
