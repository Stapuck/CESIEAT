// src/pages/HomePage.tsx
import React, { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import { Order, Client, Livreur } from '../components/OrderList';

const HomePage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ordersResponse = await fetch('https://cesieat.nathan-lorit.com/api/commandes');
        const clientsResponse = await fetch('https://cesieat.nathan-lorit.com/api/clients');
        const livreursResponse = await fetch('https://cesieat.nathan-lorit.com/api/livreurs');

        if (!ordersResponse.ok || !clientsResponse.ok || !livreursResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        setOrders(await ordersResponse.json());
        setClients(await clientsResponse.json());
        setLivreurs(await livreursResponse.json());
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className='min-h-screen'>
      <h1 className="text-3xl font-bold mb-4">Tableaux de Bord</h1>
      <Dashboard orders={orders} clients={clients} livreurs={livreurs} />
    </div>
  );
};

export default HomePage;
