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
  handleViewClientDetails: (clientId: string) => void;
  handleViewRestaurantDetails: (restaurantId: string) => void;
  handleViewOrderDetails: (order: any) => void;
  itemsPerPage: number;
  handleItemsPerPageChange: (value: number) => void;
  currentPage: number;
  handlePageChange: (direction: 'prev' | 'next') => void;
  totalOrders: number;
}

const ActiveOrders: React.FC<ActiveOrdersProps> = ({
  status,
  orders,
  getName,
  clients,
  restaurants,
  livreurs,
  handleViewLivreurDetails,
  handleViewClientDetails,
  handleViewRestaurantDetails,
  handleViewOrderDetails,
  itemsPerPage,
  handleItemsPerPageChange,
  currentPage,
  handlePageChange,
  totalOrders
}) => {
  const showLivreurColumn = !['En attente', 'Préparation', 'Prêt'].includes(status);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{status} ({totalOrders})</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor={`itemsPerPage-${status}`} className="mr-2">Afficher :</label>
          <select
            id={`itemsPerPage-${status}`}
            value={itemsPerPage}
            onChange={e => handleItemsPerPageChange(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[5, 25, 50, 75, 100].filter(option => option <= totalOrders || option === 5).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <table className="table-auto w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Commande</th>
            <th className="border border-gray-300 px-4 py-2">Client</th>
            <th className="border border-gray-300 px-4 py-2">Restaurant</th>
            <th className="border border-gray-300 px-4 py-2">Prix Total</th>
            <th className="border border-gray-300 px-4 py-2">Statut</th>
            {showLivreurColumn && <th className="border border-gray-300 px-4 py-2">Livreur</th>}
            <th className="border border-gray-300 px-4 py-2">Date de Création</th>
            <th className="border border-gray-300 px-4 py-2">Dernière MàJ</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleViewOrderDetails(order)}
                >
                  #{order._id.slice(-6)}
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleViewClientDetails(order.clientId_Zitadel)}
                >
                  {getName(order.clientId_Zitadel, clients, 'name')}
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                <button
                  className="cursor-pointer text-blue-500"
                  onClick={() => handleViewRestaurantDetails(order.restaurantId)}
                >
                  {getName(order.restaurantId, restaurants, 'restaurantName')}
                </button>
              </td>
              <td className="border border-gray-300 px-4 py-2">{order.totalAmount} €</td>
              <td className="border border-gray-300 px-4 py-2">{order.status}</td>
              {showLivreurColumn && (
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    className="cursor-pointer text-blue-500"
                    onClick={() => handleViewLivreurDetails(order.livreurId_Zitadel)}
                  >
                    {getName(order.livreurId_Zitadel, livreurs, 'name')}
                  </button>
                </td>
              )}
              <td className="border border-gray-300 px-4 py-2">{new Date(order.createdAt).toLocaleString()}</td>
              <td className="border border-gray-300 px-4 py-2">{new Date(order.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange('prev')}
          className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${currentPage === 1 ? 'invisible' : ''}`}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <span className="text-center flex-grow">Page {currentPage}</span>
        <button
          onClick={() => handlePageChange('next')}
          className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${currentPage * itemsPerPage >= totalOrders ? 'invisible' : ''}`}
          disabled={currentPage * itemsPerPage >= totalOrders}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default ActiveOrders;
