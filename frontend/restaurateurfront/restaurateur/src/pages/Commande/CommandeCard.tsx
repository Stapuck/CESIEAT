import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

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

interface IArticle {
  _id: string;
  name: string;
  reference: string;
  type: "plat" | "boisson" | "sauce" | "accompagnement";
  price: number;
  isInStock: boolean;
  image?: string;
  restaurantid: string;
}

interface ILivreur {
  _id: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  codeLivreur: string;
  livreurId_Zitadel: string;
  isAvailable: boolean;
}

interface CommandeCardProps {
  commande: ICommande;
  onValidate: (commande: ICommande) => void;
  onPrepare: (commande: ICommande) => void;
  onDeliver: (commande: ICommande, livreur: string) => void;
  onCancel: (commande: ICommande) => void;
}

interface IClient {
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
}

interface IMenu {
  name: string;
  price: number;
  articles: IArticle[];
  restaurateur: string;
}

const CommandeCard: React.FC<CommandeCardProps> = ({
  commande,
  onValidate,
  onPrepare,
  onDeliver,
  onCancel,
}) => {
  const [client, setClient] = useState<IClient>();
  const [livreur, setLivreur] = useState<ILivreur>();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [codeLivreur, setcodeLivreur] = useState<string>("");
  const [menu, setMenu] = useState<IMenu>();

  const GetClientById = async () => {
    try {
      const response = await axios.get(
        `https://localhost/api/clients/byZitadelId/${commande.clientId_Zitadel}`
      );
      setClient(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du client", error);
    }
  };

  const GetLivreurById = async () => {
    try {
      const response = await axios.get(
        `https://localhost/api/livreurs/byZitadelId/${commande.livreurId_Zitadel}`
      );
      setLivreur(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération du livreur", error);
    }
  };

  const GetMenuById = async () => {
    try {
      const response = await axios.get(
        `https://localhost/api/menus/${commande.menuId}`
      );
      setMenu(response.data);

      // Si menu contient des IDs d'articles, il faut les récupérer
      if (response.data.articles.length > 0) {
        const articlesDetails = await Promise.all(
          response.data.articles.map(async (articleId: string) => {
            const articleRes = await axios.get(
              `https://localhost/api/articles/${articleId}`
            );
            return articleRes.data; // Retourne l'objet article
          })
        );

        setMenu((prevMenu) =>
          prevMenu ? { ...prevMenu, articles: articlesDetails } : response.data
        );
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du menu", error);
    }
  };

  useEffect(() => {
    GetClientById();
    GetMenuById();
    if (commande.livreurId_Zitadel != null) {
      GetLivreurById();
    }
  }, []);

  const handleLivraison = () => {
    if (!codeLivreur) {
      toast.error("Veuillez entrer un Code livreur Valide.");
      return;
    }

    if (!livreur || codeLivreur !== livreur.codeLivreur) {
      toast.error("Code livreur incorrect.");
      return;
    }

    onDeliver(commande, codeLivreur);

    setIsModalOpen(false);
  };

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
  return (
    <div className="p-2 border  shadow-lg bg-white mb-4 transform hover:scale-101 transition duration-300">
      <p className="flex justify-center mb-1">
        {formatDate(commande.createdAt)}
      </p>


      <p className="text-gray-800 font-semibold">
        Commande id : #{commande._id.toString().slice(-6)}
      </p>
      <div className="flex justify-between">
        <p>Client : {client ? client.name : "Chargement..."}</p>
        <p>{commande.totalAmount}€</p>
      </div>

      <p className="mt-1">
        Menu: <strong>{menu ? menu.name : "Menu non disponible"}</strong>
      </p>

      {menu?.articles && menu.articles.length > 0 ? (
        <ul className="mt-1 list-disc list-inside">
          {menu.articles.map((article: IArticle, index) => (
            <li key={index}>{article.name}</li>
          ))}
        </ul>
      ) : (
        <p>Pas d'articles disponibles</p>
      )}

      {commande.status === "En livraison" && (
        <p>livreur : {livreur ? livreur.name : "Pas de livreur"}</p>
      )}

      <div className="flex justify-around">
        <div className="mt-2 gap-2">
          {commande.status === "En attente" && (
            <div className="">
              <button
                className="bg-red-500 text-white p-2 px-3 mr-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => onCancel(commande)}
              >
                Refuser
              </button>
              <button
                className="bg-blue-500 text-white p-2 px-3 ml-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => onValidate(commande)}
              >
                Valider
              </button>
            </div>
          )}

          {commande.status === "Préparation" && (
            <div className="">
              <button
                className="bg-red-500 text-white px-3 p-2 mr-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => onCancel(commande)}
              >
                Annuler
              </button>
              <button
                className="bg-yellow-500 text-white px-4 p-2 ml-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => onPrepare(commande)}
              >
                Prêt
              </button>
            </div>
          )}

          {commande.status === "Prêt" && (
            <div className="">
              <button
                className="bg-red-500 text-white p-2 px-3 mr-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => onCancel(commande)}
              >
                Annuler
              </button>
              <button
                className="bg-tertiary text-white p-2 px-2 ml-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => setIsModalOpen(true)} // Ouvrir la modal
              >
                Livraison
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Entrer le code du livreur
            </h2>
            <input
              type="text"
              value={codeLivreur}
              onChange={(e) => setcodeLivreur(e.target.value)} // Mise à jour du code livreur
              className="border p-2 mb-4 w-full"
              placeholder="Code du livreur"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-500 text-white p-2 rounded transform hover:scale-105 transition duration-300"
                onClick={() => setIsModalOpen(false)} // Fermer la modal
              >
                Annuler
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded transform hover:scale-105 transition duration-300"
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
