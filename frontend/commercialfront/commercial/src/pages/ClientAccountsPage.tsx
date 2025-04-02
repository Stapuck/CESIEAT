// src/pages/OrderManagementPage.tsx
import React from 'react';
import ClientList from '../components/ClientList';

const ClientAccountsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Gestion et Méthodes Clients</h1>
      <ClientList />
    </div>
  );
};

export default ClientAccountsPage;
