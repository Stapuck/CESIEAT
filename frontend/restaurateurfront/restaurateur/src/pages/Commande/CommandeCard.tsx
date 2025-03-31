import axios from "axios";
import React, { useEffect, useState } from "react";

interface ICommande {
  _id: string;
  client: string;
  restaurant: string;
  livreur?: string;
  items: { menuItem: []; name: string; price: number }[];
  totalAmount: number;
  status: string;
  createdAt: string;
}

interface ILivreur{
    _id : string; 
    name: string;
    email: string;
    password: string;
    phone: string;
    vehicleType: string;
    isAvailable: boolean;
    codeLivreur: string;  
  }

interface CommandeCardProps {
  commande: ICommande;
  onValidate: (commande: ICommande) => void;
  onPrepare: (commande: ICommande) => void;
  onDeliver: (commande: ICommande, livreur: string) => void; 
}

interface IClient {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
}



const CommandeCard: React.FC<CommandeCardProps> = ({
  commande,
  onValidate,
  onPrepare,
  onDeliver,
}) => {
  const [client, setClient] = useState<IClient>();
  const [livreur, setLivreur] = useState<ILivreur>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [codeLivreur, setcodeLivreur] = useState<string>("");

  const GetClientById = async () => {
    try { // todo changer les ports en 8080. 
      const response = await axios.get(
        `http://localhost:3000/api/clients/${commande.client}`
      );
      setClient(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du client", error);
    }
  };

  const GetLivreurById = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3004/api/livreurs/${commande.livreur}`
      );
      setLivreur(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du livreur", error);
    }
  };

  useEffect(() => {
    GetClientById();
    if (commande.livreur != null ){
        GetLivreurById();  
    }
  }, []);


  const handleLivraison = () => {
    if (!codeLivreur) {
      alert("Veuillez entrer un code livreur.");
      return;
    }
    //toastify here 
  
    onDeliver(commande, codeLivreur);
    
    setIsModalOpen(false); 
  };
  

  return (
    <div className="p-4 border rounded shadow-lg bg-white mb-4">
      <p className="text-gray-800 font-semibold">
        Commande id : {commande._id}
      </p>
      <p>
        Client : {client ? client.name : "Chargement..."}
      </p>
      <p>{commande.totalAmount}€</p>
      <p>{new Date(commande.createdAt).toLocaleString()}</p> 
      <p className="text-gray-600">Statut: {commande.status}</p>
      {commande.status === "En livraison" && (
        <>
        <p>{livreur ? livreur.name : "Pas de livreur"}</p>
        </>
      )}

      <div className="mt-2 flex justify-end gap-2">
        {commande.status === "En attente" && (
          <button
            className="bg-blue-500 text-white p-2 rounded"
            onClick={() => onValidate(commande)}
          >
            Valider
          </button>
        )}

        {commande.status === "Préparation" && (
          <button
            className="bg-yellow-500 text-white p-2 rounded"
            onClick={() => onPrepare(commande)}
          >
            Prêt
          </button>
        )}

        {commande.status === "Prêt" && (
          <button
            className="bg-green-500 text-white p-2 rounded"
            onClick={() => setIsModalOpen(true)} // Ouvrir la modal
          >
            Livraison
          </button>
        )}
      </div>

      {/* Modal */}
      
        {isModalOpen && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
                <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-lg font-semibold mb-4">Entrer le code du livreur</h2>
                <input
                    type="text"
                    value={codeLivreur}
                    onChange={(e) => setcodeLivreur(e.target.value)} // Mise à jour du code livreur
                    className="border p-2 mb-4 w-full"
                    placeholder="Code du livreur"
                />
                <div className="flex justify-end gap-2">
                    <button
                    className="bg-gray-500 text-white p-2 rounded"
                    onClick={() => setIsModalOpen(false)} // Fermer la modal
                    >
                    Annuler
                    </button>
                    <button
                    className="bg-green-500 text-white p-2 rounded"
                    onClick={() => handleLivraison()} // Confirmer livraison
                    >
                    Confirmer Livraison
                    </button>
                </div>
                </div>
            </div>
        )}

    </div>
  );
};

export default CommandeCard;

