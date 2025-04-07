// src/pages/OrderManagementPage.tsx
import React from 'react';
import OrderList from '../components/OrderList';

const OrderManagementPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Vue Détaillée des Commandes</h1>
      <OrderList />
    </div>
  );
};

export default OrderManagementPage;
