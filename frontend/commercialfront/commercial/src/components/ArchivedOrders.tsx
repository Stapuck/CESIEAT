import React from 'react';
import Swal from 'sweetalert2';

interface ArchivedOrdersProps {
  orders: any[];
  showArchived: boolean;
  setShowArchived: React.Dispatch<React.SetStateAction<boolean>>;
  getName: (id: string, list: any[], key: string) => string;
  clients: any[];
  restaurants: any[];
  livreurs: any[];
}

const ArchivedOrders: React.FC<ArchivedOrdersProps> = ({ orders, showArchived, setShowArchived, getName, clients, restaurants, livreurs }) => {
  const deliveredOrders = orders.filter(order => order.status === 'Livrée');
  const canceledOrders = orders.filter(order => order.status === 'Annulée');

  const handleShowLivreurDetails = (livreurId: string) => {
    const livreur = livreurs.find(l => l._id === livreurId);
    if (livreur) {
      Swal.fire({
        title: 'Détails du Livreur',
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;">
            <p><strong>Nom :</strong> ${livreur.name}</p>
            <p><strong>Email :</strong> ${livreur.email}</p>
            <p><strong>Téléphone :</strong> ${livreur.phone}</p>
            <p><strong>Type de Véhicule :</strong> ${livreur.vehiculeType}</p>
            <p><strong>Code Livreur :</strong> ${livreur.codeLivreur}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } else {
      Swal.fire('Erreur', 'Détails du livreur introuvables.', 'error');
    }
  };

  return (
    <div className="mb-8">
      <button
        onClick={() => setShowArchived(!showArchived)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        {showArchived ? 'Masquer les commandes livrées et annulées' : 'Afficher les commandes livrées et annulées'}
      </button>
      {showArchived && (
        <>
          {deliveredOrders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-bold mb-4">
                Commandes livrées ({deliveredOrders.length})
              </h2>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Client</th>
                    <th className="border border-gray-300 px-4 py-2">Commande</th>
                    <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                    <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                    <th className="border border-gray-300 px-4 py-2">Créée le</th>
                    <th className="border border-gray-300 px-4 py-2">Livreur</th>
                    <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveredOrders.map(order => (
                    <tr key={order._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {getName(order.client, clients, 'name')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-6)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {getName(order.restaurant, restaurants, 'restaurantName')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-gray-200 text-blue-500 px-2 py-1 rounded"
                          onClick={() => handleShowLivreurDetails(order.livreur)}
                        >
                          {getName(order.livreur, livreurs, 'name')}
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(order.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {canceledOrders.length > 0 && (
            <div>
              <h2 className="text-lg font-bold mb-4">
                Commandes annulées ({canceledOrders.length})
              </h2>
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2">Client</th>
                    <th className="border border-gray-300 px-4 py-2">Commande</th>
                    <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                    <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                    <th className="border border-gray-300 px-4 py-2">Créée le</th>
                    <th className="border border-gray-300 px-4 py-2">Livreur</th>
                    <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
                  </tr>
                </thead>
                <tbody>
                  {canceledOrders.map(order => (
                    <tr key={order._id}>
                      <td className="border border-gray-300 px-4 py-2">
                        {getName(order.client, clients, 'name')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">#{order._id.slice(-6)}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {getName(order.restaurant, restaurants, 'restaurantName')}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">{order.totalAmount}</td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          className="bg-gray-200 text-blue-500 px-2 py-1 rounded"
                          onClick={() => handleShowLivreurDetails(order.livreur)}
                        >
                          {getName(order.livreur, livreurs, 'name')}
                        </button>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        {new Date(order.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {deliveredOrders.length === 0 && canceledOrders.length === 0 && (
            <p className="text-gray-500">Aucune commande livrée ou annulée.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ArchivedOrders;
