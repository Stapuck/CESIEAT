import React, { useEffect, useState } from 'react';
import axios from 'axios';
import QRCodeGenerator from './QRCodeGenerator'; // Assurez-vous que le chemin est correct

interface MenuItem {
  menuItem: string;
  quantity: number;
  _id: string;
}

interface Order {
  _id: string;
  client: string;
  restaurant: string;
  livreur: string | null;
  items?: MenuItem[];
  menu?: string;
  status?: string;
  // Autres champs potentiels
  montant?: number;
  date?: string;
  adresseLivraison?: string;
}

const OrderHistory = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/commandes');
        // Filtrer uniquement les commandes avec un livreur assigné (en livraison)
        const commandesEnLivraison = response.data.filter((order: Order) => order.livreur !== null);
        setOrders(commandesEnLivraison);
        setLoading(false);
        console.log('Commandes en livraison:', commandesEnLivraison);
      } catch (err) {
        console.error('Erreur lors de la récupération des commandes:', err);
        setError('Impossible de charger les commandes. Veuillez réessayer plus tard.');
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        Commandes en Livraison
      </h2>
      
      {loading && (
        <div className="flex justify-center items-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          {error}
        </div>
      )}
      
      {!loading && !error && (
        orders.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {orders.map(order => (
              <li key={order._id} className="py-4 flex flex-col hover:bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-blue-600">Commande #{order._id.substr(-6)}</span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    En livraison
                  </span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Restaurant ID: {order.restaurant}</span>
                  <span>Livreur ID: {order.livreur}</span>
                </div>

                <QRCodeGenerator commandeId={order._id}  />

                
                {order.items && (
                  <div className="mt-2 text-sm">
                    <p className="font-medium text-gray-700">Détails:</p>
                    <ul className="list-disc pl-5">
                      {order.items.map(item => (
                        <li key={item._id} className="text-gray-600">
                          {item.menuItem} x{item.quantity}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {order.montant && (
                  <div className="mt-2 self-end">
                    <span className="font-bold">{order.montant}€</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Aucune commande en cours de livraison</p>
            <p className="text-sm text-gray-400">Vos commandes en livraison apparaîtront ici</p>
          </div>
        )
      )}
    </section>
  );
};

export default OrderHistory;
