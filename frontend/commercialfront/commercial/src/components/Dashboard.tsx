import React, { useState } from 'react';
import { Client, Livreur } from './OrderList';

interface Order {
  _id: string;
  clientId_Zitadel: string;
  livreurId_Zitadel: string;
  restaurantId: string;
  menuId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface DashboardProps {
  orders: Order[];
  clients: Client[];
  livreurs: Livreur[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, clients, livreurs }) => {
  const [duration, setDuration] = useState<string>(''); // Default to empty

  // Calculations
  const totalClients = clients.length;
  const activeClients = clients.filter(client => !client.isPaused).length;
  const suspendedClients = clients.filter(client => client.isPaused).length;

  const totalLivreurs = livreurs.length;
  const totalAccounts = totalClients + totalLivreurs;

  const totalOrders = orders.length;
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  const transactionalRevenue = orders
    .filter(order => ['Préparation', 'Prêt', 'En attente', 'En livraison'].includes(order.status))
    .reduce((acc, order) => acc + order.totalAmount, 0);

  const filteredOrders = orders.filter(order => {
    const now = new Date();
    const orderDate = new Date(order.createdAt);
    switch (duration) {
      case 'hour':
        return now.getTime() - orderDate.getTime() <= 3600000;
      case 'day':
        return now.toDateString() === orderDate.toDateString();
      case 'yesterday': {
        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const endOfYesterday = new Date(yesterday);
        endOfYesterday.setHours(23, 59, 59, 999);
        return orderDate >= yesterday && orderDate <= endOfYesterday;
      }
      case 'week': {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return orderDate >= startOfWeek;
      }
      case 'month': {
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1));
        return orderDate >= startOfMonth && orderDate < endOfMonth;
      }
      case 'year':
        return now.getFullYear() === orderDate.getFullYear();
      default:
        return false;
    }
  });
  const filteredRevenue = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 bg-gray-100 rounded-lg">
      {/* Revenue Section */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">Chiffre d'affaires total</h2>
        <p className="text-sm italic text-gray-500 mt-2">
          Le montant total du chiffre d'affaires comprenant l'ensemble des commandes en ne faisant aucune différence de status.
        </p>
        <p className="text-2xl font-bold mt-4">{totalRevenue.toFixed(2)} €</p>
      </div>

      {/* Transactional Revenue Section */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">Chiffre d'affaires transactionnel global en cours</h2>
        <p className="text-sm italic text-gray-500 mt-2">
          Le montant du chiffre d'affaires transactionnel global en cours en fonction des commandes par période.
        </p>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-4 block w-full border border-gray-300 rounded py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            Sélectionnez une durée
          </option>
          <option value="hour">Dernière heure</option>
          <option value="day">Aujourd'hui</option>
          <option value="yesterday">Hier</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
        </select>
        <p className="text-2xl font-bold mt-4">{filteredRevenue.toFixed(2)} €</p>
      </div>

      {/* Accounts Section */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">
          Comptes <span className="text-gray-500">({totalAccounts})</span>
        </h2>
        <p className="text-sm italic text-gray-500 mt-2">
          Détails des comptes clients actifs, suspendus et livreurs.
        </p>
        <ul className="mt-2 space-y-2">
          <li className="flex justify-between">
            <span className="font-medium">Clients actifs :</span>
            <span className="text-gray-600">{activeClients}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Clients suspendus :</span>
            <span className="text-gray-600">{suspendedClients}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Livreurs :</span>
            <span className="text-gray-600">{totalLivreurs}</span>
          </li>
        </ul>
      </div>

      {/* Orders Section */}
      <div className="p-6 bg-white shadow rounded-lg">
        <h2 className="text-lg font-semibold">
          Commandes <span className="text-gray-500">({totalOrders})</span>
        </h2>
        <p className="text-sm italic text-gray-500 mt-2">
          Répartition des commandes par statut.
        </p>
        <ul className="mt-2 space-y-2">
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <li key={status} className="flex justify-between">
              <span className="font-medium">{status} :</span>
              <span className="text-gray-600">{count}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
