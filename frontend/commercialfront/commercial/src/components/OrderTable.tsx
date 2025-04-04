import React from 'react';

interface OrderTableProps {
  status: string;
  orders: any[];
  getName: (id: string, list: any[], key: string) => string;
  clients: any[];
  restaurants: any[];
  livreurs: any[];
  handleViewLivreurDetails: (livreurId: string) => void;
  statuses: string[]; // Add statuses prop
}

const OrderTable: React.FC<OrderTableProps> = ({ status, orders, getName, clients, restaurants, livreurs, handleViewLivreurDetails, statuses }) => {
  const showLivreurColumn = !['En attente', 'Préparation', 'Prêt'].includes(status);

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">
        {status} ({orders.length})
      </h2>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            {statuses.map((header, index) => (
              <th key={index} className="border border-gray-300 px-4 py-2">{header}</th>
            ))}
            {showLivreurColumn && <th className="border border-gray-300 px-4 py-2">Livreur</th>}
            <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 ? (
            orders.map(order => (
              <tr key={order._id}>
                <td className="border border-gray-300 px-4 py-2">{getName(order.client, clients, 'name')}</td>
                <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-6)}</td>
                <td className="border border-gray-300 px-4 py-2">{getName(order.restaurant, restaurants, 'restaurantName')}</td>
                <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
                <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
                <td className="border border-gray-300 px-4 py-2">{order.status}</td>
                {showLivreurColumn && (
                  <td className="border border-gray-300 px-4 py-2">
                    <button
                      className="text-blue-500 underline"
                      onClick={() => handleViewLivreurDetails(order.livreur)}
                    >
                      {getName(order.livreur, livreurs, 'name')}
                    </button>
                  </td>
                )}
                <td className="border border-gray-300 px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="border border-gray-300 px-4 py-2 text-center" colSpan={showLivreurColumn ? 8 : 7}>
                Aucune commande correspondant à ce statut.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable;
