import React, { useState } from 'react';
import { Order, Client, Livreur } from './OrderList';

interface DashboardProps {
  orders: Order[];
  clients: Client[];
  livreurs: Livreur[];
}

const Dashboard: React.FC<DashboardProps> = ({ orders, clients, livreurs }) => {
  const [duration, setDuration] = useState<string>(''); // Default to empty

  // Calculations
  const totalClients = clients.length;
  const activeClients = clients.filter(client => client.status === 'active').length;
  const suspendedClients = clients.filter(client => client.status === 'suspended').length;

  const totalLivreurs = livreurs.length;
  const totalAccounts = totalClients + totalLivreurs;

  const totalOrders = orders.length;
  const ordersByStatus = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0);

  // Placeholder for real-time transactional revenue logic
  const transactionalRevenue = orders
    // Replace this filter with real-time logic in the future
    .filter(order => order.status === 'en ce moment') // Example placeholder
    .reduce((acc, order) => acc + order.totalAmount, 0);

  const filteredOrders = orders.filter(order => {
    const now = new Date();
    const orderDate = new Date(order.createdAt); // Assuming `createdAt` exists
    switch (duration) {
      case 'hour':
        return now.getTime() - orderDate.getTime() <= 3600000; // Last hour
      case 'day':
        return now.toDateString() === orderDate.toDateString(); // Same day
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return orderDate >= startOfWeek;
      case 'month': {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        return orderDate >= startOfMonth && orderDate <= endOfMonth; // Entire month
      }
      case 'year':
        return now.getFullYear() === orderDate.getFullYear(); // Same year
      default:
        return false; // No duration selected
    }
  });
  const filteredRevenue = filteredOrders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="grid grid-cols-1 gap-4">
      {/* Revenue Section */}
      <div className="p-4 border rounded">
        <h2>Chiffre d'Affaires Total</h2>
        <p>{totalRevenue.toFixed(2)} €</p>
      </div>

      {/* Transactional Revenue Section */}
      <div className="p-4 border rounded">
        <h2>Chiffre d'Affaires en Cours</h2>
        <p>{transactionalRevenue.toFixed(2)} €</p>
        {/* Replace the above calculation with real-time logic */}
      </div>

      {/* Filtered Revenue Section */}
      <div className="p-4 border rounded">
        <h2>Chiffre d'Affaires par Durée</h2>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="mt-2 block w-full border border-gray-300 rounded py-2 px-3"
        >
          <option value="" disabled>
            Sélectionnez une durée
          </option>
          <option value="hour">Dernière Heure</option>
          <option value="day">Aujourd'hui</option>
          <option value="week">Cette Semaine</option>
          <option value="month">Ce Mois</option>
          <option value="year">Cette Année</option>
        </select>
        <p className="mt-4">{filteredRevenue.toFixed(2)} €</p>
      </div>

      {/* Accounts Section */}
      <div className="p-4 border rounded">
        <h2>
          Comptes <span>({totalAccounts})</span>
        </h2>
        <p>Clients Actifs : {activeClients}</p>
        <p>Clients Suspendus : {suspendedClients}</p>
        <p>Livreurs : {totalLivreurs}</p>
      </div>

      {/* Orders Section */}
      <div className="p-4 border rounded">
        <h2>
          Commandes <span>({totalOrders})</span>
        </h2>
        <ul>
          {Object.entries(ordersByStatus).map(([status, count]) => (
            <li key={status}>
              {status} : {count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
