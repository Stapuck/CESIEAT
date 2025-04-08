// src/pages/ClientAccountsPage.tsx
import React from 'react';
import ClientList from '../components/ClientList';

const ClientAccountsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Gestion des Comptes Clients</h1>
      <ClientList />
    </div>
  );
};

export default ClientAccountsPage;
