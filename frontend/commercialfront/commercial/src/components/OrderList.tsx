// src/components/OrderList.tsx
import React, { useState, useEffect } from 'react';

interface Order {
  _id: string;
  client: string;
  restaurant: string;
  livreur: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Client {
  _id: string;
  name: string;
}

interface Restaurant {
  _id: string;
  name: string;
}

interface Livreur {
  _id: string;
  name: string;
}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false); // State to toggle archived orders visibility

  useEffect(() => {
    const fetchOrders = async () => {
      console.log('Fetching orders...');
      try {
        const response = await fetch('http://localhost:8080/api/commandes');
        console.log(`Response status: ${response.status}`);
        console.log(`Response headers:`, response.headers);
        if (!response.ok) {
          const errorText = await response.text();
          console.error(`Error response body: ${errorText}`);
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched orders:', data);
        setOrders(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching orders:', error);
        console.error('Error details:', error instanceof Error ? error.message : error);
        setError('Failed to load orders. Please try again.');
      }
    };

    const fetchClients = async () => {
      console.log('Fetching clients...');
      try {
        const response = await fetch('http://localhost:8080/api/clients');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched clients:', data);
        setClients(data);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchRestaurants = async () => {
      console.log('Fetching restaurants...');
      try {
        const response = await fetch('http://localhost:8080/api/restaurateurs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched restaurants:', data);
        setRestaurants(data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    const fetchLivreurs = async () => {
      console.log('Fetching livreurs...');
      try {
        const response = await fetch('http://localhost:8080/api/livreurs');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('Fetched livreurs:', data);
        setLivreurs(data);
      } catch (error) {
        console.error('Error fetching livreurs:', error);
      }
    };

    fetchOrders();
    fetchClients();
    fetchRestaurants();
    fetchLivreurs();
  }, []);

  const getClientName = (clientId: string) => {
    const client = clients.find((c) => c._id === clientId);
    return client ? client.name : '/Err\\';
  };

  const getRestaurantName = (restaurantId: string) => {
    const restaurant = restaurants.find((r) => r._id === restaurantId);
    return restaurant ? restaurant.name : '/Err\\';
  };

  const getLivreurName = (livreurId: string) => {
    const livreur = livreurs.find((l) => l._id === livreurId);
    return livreur ? livreur.name : '/Err\\';
  };

  const statuses = ['En attente', 'Préparation', 'Prêt', 'En livraison', 'Livrée']; // Updated statuses

  const renderTable = (status: string) => {
    const filteredOrders = orders.filter(order => order.status === status);

    return (
      <div key={status} className="mb-8">
        <h2 className="text-lg font-bold mb-4">{status}</h2>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Client</th>
              <th className="border border-gray-300 px-4 py-2">Commande</th>
              <th className="border border-gray-300 px-4 py-2">Restaurant</th>
              <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
              <th className="border border-gray-300 px-4 py-2">Créée le</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Livreur</th>
              <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="border border-gray-300 px-4 py-2">{getClientName(order.client)}</td>
                  <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-5)}</td>
                  <td className="border border-gray-300 px-4 py-2">{getRestaurantName(order.restaurant)}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                  <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                  <td className="border border-gray-300 px-4 py-2">{getLivreurName(order.livreur)}</td>
                  <td className="border border-gray-300 px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border border-gray-300 px-4 py-2 text-center" colSpan={8}>
                  Aucune commande correspondant à ce statut.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderArchivedTable = () => {
    const archivedOrders = orders.filter(order => order.status === 'Livrée');

    return (
      <div className="mb-8">
        <button
          onClick={() => setShowArchived(!showArchived)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {showArchived ? 'Masquer les commandes livrées' : 'Afficher les commandes livrées'}
        </button>
        {showArchived && (
          <div>
            <h2 className="text-lg font-bold mb-4">Commandes Livrées</h2>
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">Client</th>
                  <th className="border border-gray-300 px-4 py-2">Commande</th>
                  <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                  <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                  <th className="border border-gray-300 px-4 py-2">Créée le</th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                  <th className="border border-gray-300 px-4 py-2">Livreur</th>
                  <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
                </tr>
              </thead>
              <tbody>
                {archivedOrders.length > 0 ? (
                  archivedOrders.map(order => (
                    <tr key={order._id}>
                      <td className="border border-gray-300 px-4 py-2">{getClientName(order.client)}</td>
                      <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-5)}</td> {/* Updated to include # prefix */}
                      <td className="border border-gray-300 px-4 py-2">{getRestaurantName(order.restaurant)}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                      <td className="border border-gray-300 px-4 py-2">{getLivreurName(order.livreur)}</td>
                      <td className="border border-gray-300 px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border border-gray-300 px-4 py-2 text-center" colSpan={8}>
                      Aucune commande livrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {statuses.filter(status => status !== 'Livrée').map(status => renderTable(status))}
      {renderArchivedTable()}
    </div>
  );
};

export default OrderList;
