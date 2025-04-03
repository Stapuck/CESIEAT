// src/components/OrderList.tsx
import React, { useState, useEffect } from 'react';
import OrderTable from './OrderTable';
import ArchivedOrders from './ArchivedOrders';
import Swal from 'sweetalert2';

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [clients, setClients] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [livreurs, setLivreurs] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchData = async (endpoint: string, setter: React.Dispatch<any>, errorSetter?: React.Dispatch<any>) => {
      try {
        const response = await fetch(`http://localhost:8080/api/${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await response.json();
        setter(data);
      } catch (err) {
        if (errorSetter) errorSetter(err.message);
      }
    };

    fetchData('commandes', setOrders, setError);
    fetchData('clients', setClients);
    fetchData('restaurateurs', setRestaurants);
    fetchData('livreurs', setLivreurs);
  }, []);

  const getName = (id: string, list: any[], key: string) => {
    const item = list.find((i) => i._id === id);
    return item ? item[key] : '/Err\\';
  };

  const handleViewLivreurDetails = async (livreurId: string) => {
    try {
      const response = await fetch(`http://localhost:8080/api/livreurs/${livreurId}`);
      if (!response.ok) throw new Error('Failed to fetch livreur details');
      const livreur = await response.json();

      Swal.fire({
        title: 'Détails du Livreur',
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;">
            <p><strong>Nom et prénom :</strong> ${livreur.name}</p>
            <p><strong>Email :</strong> ${livreur.email}</p>
            <p><strong>Téléphone :</strong> ${livreur.phone}</p>
            <p><strong>Type de véhicule :</strong> ${livreur.vehiculeType}</p>
            <p><strong>Code livreur :</strong> ${livreur.codeLivreur}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } catch {
      Swal.fire('Erreur', 'Impossible de charger les détails du livreur.', 'error');
    }
  };

  const statuses = ['En attente', 'Préparation', 'Prêt', 'En livraison', 'Livrée'];

  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    return (
      getName(order.client, clients, 'name').toLowerCase().includes(searchLower) ||
      getName(order.restaurant, restaurants, 'restaurantName').toLowerCase().includes(searchLower) ||
      (order.livreur && getName(order.livreur, livreurs, 'name').toLowerCase().includes(searchLower)) ||
      order._id.includes(searchLower)
    );
  });

  const sortedOrders = [...filteredOrders].sort((a, b) =>
    sortOrder === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt)
  );

  const filteredStatusOrders = (status: string) =>
    sortedOrders.filter(order => order.status === status);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Rechercher une commande... (sans le #)"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            onClick={() => setSortOrder('asc')}
            className={`px-4 py-2 rounded ${sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            Croissant
          </button>
          <button
            onClick={() => setSortOrder('desc')}
            className={`px-4 py-2 rounded ${sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
          >
            Décroissant
          </button>
        </div>
      </div>
      {statuses
        .filter(status => status !== 'Livrée')
        .map(status => {
          const ordersForStatus = filteredStatusOrders(status);
          if (ordersForStatus.length === 0) return null; // Hide empty tables
          return (
            <OrderTable
              key={status}
              status={status}
              orders={ordersForStatus}
              getName={getName}
              clients={clients}
              restaurants={restaurants}
              livreurs={livreurs}
              handleViewLivreurDetails={handleViewLivreurDetails}
            />
          );
        })}
      <ArchivedOrders
        orders={sortedOrders}
        showArchived={showArchived}
        setShowArchived={setShowArchived}
        getName={getName}
        clients={clients}
        restaurants={restaurants}
        livreurs={livreurs}
        handleViewLivreurDetails={handleViewLivreurDetails}
      />
    </div>
  );
};

export default OrderList;
