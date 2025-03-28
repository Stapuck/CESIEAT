import axios from "axios";
import { useEffect, useState } from "react";

interface ICommande {
  client: string;
  restaurant: string;
  livreur?: string;
  items: { menuItem: string; name: string; price: number; }[];
  totalAmount: number;
  status: string;
  createdAt: string; 
  updatedAt: string;
}

const HistoriqueCommande = () => {
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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



  //todo get les nom prénoms des clients et livreur en fonction des id. 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Historique des Commandes</h1>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 px-4 py-2">Client</th>
            <th className="border border-gray-300 px-4 py-2">Restaurant</th>
            <th className="border border-gray-300 px-4 py-2">Livreur</th>
            <th className="border border-gray-300 px-4 py-2">Items</th>
            <th className="border border-gray-300 px-4 py-2">Montant Total</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            <th className="border border-gray-300 px-4 py-2">creer le </th>
            <th className="border border-gray-300 px-4 py-2">last update  </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? ('Loading') : (
            <>
          {commandes.map((commande, index) => (
            <tr key={index} className="text-center border border-gray-300">
              <td className="border border-gray-300 px-4 py-2">{commande.client}</td>
              <td className="border border-gray-300 px-4 py-2">{commande.restaurant}</td>
              <td className="border border-gray-300 px-4 py-2">{commande.livreur || "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">
                {commande.items.map((item, i) => (
                  <div key={i}>{item.menuItem} - {item.name} - {item.price}€</div>
                ))}
              </td>
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
