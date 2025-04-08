import React from 'react';

interface ArchivedOrdersProps {
  orders: any[];
  showArchived: boolean;
  setShowArchived: React.Dispatch<React.SetStateAction<boolean>>;
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
}

const ArchivedOrders: React.FC<ArchivedOrdersProps> = ({
  orders,
  showArchived,
  setShowArchived,
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
  handlePageChange
}) => {
  const deliveredOrders = orders.filter(order => order.status === 'Livrée');
  const canceledOrders = orders.filter(order => order.status === 'Annulée');

  const paginatedOrders = (orders: any[], currentPage: number, itemsPerPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return orders.slice(startIndex, endIndex);
  };

  const paginatedDeliveredOrders = paginatedOrders(deliveredOrders, currentPage, itemsPerPage);
  const paginatedCanceledOrders = paginatedOrders(canceledOrders, currentPage, itemsPerPage);

  return (
    <div>
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
      >
        {showArchived ? 'Masquer les commandes livrées et annulées' : 'Afficher les commandes livrées et annulées'}
      </button>
      {showArchived && (
        <>
          {deliveredOrders.length === 0 && canceledOrders.length === 0 ? (
            <p className="text-gray-500">Aucune commande livrée ou annulée</p>
          ) : (
            <>
              {deliveredOrders.length > 0 && (
                <div className="p-4 bg-white shadow rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                      Commandes livrées ({deliveredOrders.length})
                    </h2>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="itemsPerPage-delivered" className="mr-2">Afficher :</label>
                      <select
                        id="itemsPerPage-delivered"
                        value={itemsPerPage}
                        onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {[10, 25, 50, 75, 100].filter(option => option <= deliveredOrders.length || option === 10).map(option => (
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
                        <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                        <th className="border border-gray-300 px-4 py-2">Statut</th>
                        <th className="border border-gray-300 px-4 py-2">Livreur</th>
                        <th className="border border-gray-300 px-4 py-2">Date de Création</th>
                        <th className="border border-gray-300 px-4 py-2">Dernière MàJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedDeliveredOrders.map(order => (
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
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              className="cursor-pointer text-blue-500"
                              onClick={() => handleViewLivreurDetails(order.livreurId_Zitadel)}
                            >
                              {getName(order.livreurId_Zitadel, livreurs, 'name')}
                            </button>
                          </td>
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
                      className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${currentPage * itemsPerPage >= deliveredOrders.length ? 'invisible' : ''}`}
                      disabled={currentPage * itemsPerPage >= deliveredOrders.length}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
              {canceledOrders.length > 0 && (
                <div className="p-4 bg-white shadow rounded-lg mb-4">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold">
                      Commandes annulées ({canceledOrders.length})
                    </h2>
                    <div className="flex items-center space-x-2">
                      <label htmlFor="itemsPerPage-canceled" className="mr-2">Afficher :</label>
                      <select
                        id="itemsPerPage-canceled"
                        value={itemsPerPage}
                        onChange={e => handleItemsPerPageChange(Number(e.target.value))}
                        className="p-2 border rounded"
                      >
                        {[10, 25, 50, 75, 100].filter(option => option <= canceledOrders.length || option === 10).map(option => (
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
                        <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                        <th className="border border-gray-300 px-4 py-2">Statut</th>
                        <th className="border border-gray-300 px-4 py-2">Livreur</th>
                        <th className="border border-gray-300 px-4 py-2">Date de Création</th>
                        <th className="border border-gray-300 px-4 py-2">Dernière MàJ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedCanceledOrders.map(order => (
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
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              className="cursor-pointer text-blue-500"
                              onClick={() => handleViewLivreurDetails(order.livreurId_Zitadel)}
                            >
                              {getName(order.livreurId_Zitadel, livreurs, 'name')}
                            </button>
                          </td>
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
                      className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${currentPage * itemsPerPage >= canceledOrders.length ? 'invisible' : ''}`}
                      disabled={currentPage * itemsPerPage >= canceledOrders.length}
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ArchivedOrders;
