import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ICommande {
  _id: string;
  client: string;
  restaurant: string;
  livreur?: string;
  items: { menuItem: []; name: string; price: number; }[];
  totalAmount: number;
  status: string;
}

const CommandesPage = () => {
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showNouvellesCommandes, setShowNouvellesCommandes] = useState(true);
  const [showEnPreparationCommandes, setShowEnPreparationCommandes] = useState(true);
  const [showEnAttenteDeRecupCommandes, setShowEnAttenteDeRecupCommandes] = useState(true);
  const [showEnLivraisonCommandes, setShowEnLivraisonCommandes] = useState(true);
  const [showLivreeCommande, setShowLivreeCommande] = useState(true);

  const getCommandes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3003/api/commandes");
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


  // const handleValidation = (commandeId : ICommande) => {
  //   // Logique pour valider la commande, peut-être une mise à jour du statut
  //   console.log("Commande validée:", commandeId);
  //   // Vous pouvez ici mettre à jour l'état pour refléter ce changement.
  // };
  
  // const handlePreparation = (commandeId : ICommande) => {
  //   // Logique pour marquer la commande comme prête
  //   console.log("Commande marquée comme prête:", commandeId);
  //   // Mettez à jour l'état ou envoyez une requête au backend pour modifier le statut.
  // };
  
  // const handleLivraison = (commandeId : ICommande) => {
  //   // Logique pour marquer la commande comme livrée
  //   console.log("Commande en livraison:", commandeId);
  //   // Mettez à jour l'état ou envoyez une requête au backend pour modifier le statut.
  // };
  

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
        {/* //Nouvelle Commande*/}
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
                  nouvellesCommandes.map((commande, index) => (
                    <div key={index} className="p-2 mb-2 border-b">
                      <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                      <p>Status: {commande.status}</p>
                    </div>
                  ))
                )
              )}
            </div>
          )}
        </div> 

        {/* Nouvelle Commande */}
{/* <div className="bg-white p-4 rounded shadow-lg">
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
          nouvellesCommandes.map((commande, index) => (
            <div key={index} className="p-2 mb-2 border-b">
              <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
              <p>Status: {commande.status}</p>

              //  Affichage des boutons selon le statut de la commande 
              {commande.status === "En attente" && (
                <button
                  className="bg-blue-500 text-white p-2 rounded"
                  onClick={() => handleValidation(commande)} // Vous pouvez ajouter la fonction de gestion pour la validation
                >
                  Valider
                </button>
              )}

              {commande.status === "Préparation" && (
                <button
                  className="bg-yellow-500 text-white p-2 rounded"
                  onClick={() => handlePreparation(commande)} // Ajoutez la fonction de gestion pour marquer comme prêt
                >
                  Prêt
                </button>
              )}

              {commande.status === "Prêt" && (
                <button
                  className="bg-green-500 text-white p-2 rounded"
                  onClick={() => handleLivraison(commande)} // Ajoutez la fonction de gestion pour la livraison
                >
                  Livraison
                </button>
              )}
            </div>
          ))
        )
      )}
    </div>
  )}
</div> */}


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
                  enPreparationCommandes.map((commande, index) => (
                    <div key={index} className="p-2 mb-2 border-b">
                      <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                      <p>Status: {commande.status}</p>
                    </div>
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
                  <p className="text-gray-600">Aucune commande en attente pour le moment.</p>
                ) : (
                  enAttenteDeRecupCommandes.map((commande, index) => (
                    <div key={index} className="p-2 mb-2 border-b">
                      <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                      <p>Status: {commande.status}</p>
                    </div>
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
                  <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
                ) : (
                  enLivraisonCommandes.map((commande, index) => (
                    <div key={index} className="p-2 mb-2 border-b">
                      <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                      <p>Status: {commande.status}</p>
                    </div>
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
                  <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
                ) : (
                  LivreeCommande.map((commande, index) => (
                    <div key={index} className="p-2 mb-2 border-b">
                      <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                      <p>Status: {commande.status}</p>
                    </div>
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




// // question : faire 3 appel dans commande en fonction du status des commandes ??
// // sinon revoir npm i @asseinfo/react-kanban \\ @asseinfo/react-kanban


// faire des cartes commandes pour mieux gerer les boutons, les appels et autres. 

// faire  des boutons qui apparaisse ou disparaisse dynamiquement en fonction du status de la commande. 

// to do 