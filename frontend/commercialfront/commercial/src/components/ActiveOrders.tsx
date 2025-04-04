import React from 'react';

interface ActiveOrdersProps {
  status: string;
  orders: {
    _id: string;
    clientId_Zitadel: string;
    livreurId_Zitadel: string;
    restaurantId: string;
    menuId: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
  getName: (id: string, list: any[], key: string) => string;
  clients: any[];
  restaurants: any[];
  livreurs: any[];
  handleViewLivreurDetails: (livreurId: string) => void;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({ status, orders, getName, clients, restaurants, livreurs, handleViewLivreurDetails }) => {
  const showLivreurColumn = !['En attente', 'Préparation', 'Prêt'].includes(status);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">
        {status} ({orders.length})
      </h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Client</th>
            <th className="border border-gray-300 px-4 py-2">Commande</th>
            <th className="border border-gray-300 px-4 py-2">Restaurant</th>
            <th className="border border-gray-300 px-4 py-2">Menu ID</th>
            <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
            <th className="border border-gray-300 px-4 py-2">Créée le</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            {showLivreurColumn && <th className="border border-gray-300 px-4 py-2">Livreur</th>}
            <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="border border-gray-300 px-4 py-2">{getName(order.clientId_Zitadel, clients, 'name')}</td>
              <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-6)}</td>
              <td className="border border-gray-300 px-4 py-2">{getName(order.restaurantId, restaurants, 'restaurantName')}</td>
              <td className="border border-gray-300 px-4 py-2">{order.menuId}</td>
              <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              {showLivreurColumn && (
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="text-blue-500 underline"
                    onClick={() => handleViewLivreurDetails(order.livreurId_Zitadel)}
                  >
                    {getName(order.livreurId_Zitadel, livreurs, 'name')}
                  </button>
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActiveOrders;
