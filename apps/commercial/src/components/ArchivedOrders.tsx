import React from 'react';
import Swal from 'sweetalert2';

interface ArchivedOrdersProps {
  orders: any[];
  showArchived: boolean;
  setShowArchived: React.Dispatch<React.SetStateAction<boolean>>;
  getName: (id: string, data: any[], key: string) => string;
  clients: any[];
  restaurants: any[];
  livreurs: any[];
  handleViewLivreurDetails: (livreurId: string) => void;
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
}) => {
  const archivedOrders = orders.filter(order => order.status === 'Livrée');

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
        {showArchived ? 'Masquer les commandes livrées' : 'Afficher les commandes livrées'}
      </button>
      {showArchived && archivedOrders.length > 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">
            Commandes livrées ({archivedOrders.length})
          </h2>
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Client</th>
                <th className="border border-gray-300 px-4 py-2">Commande</th>
                <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                <th className="border border-gray-300 px-4 py-2">Prix Total (€)</th>
                <th className="border border-gray-300 px-4 py-2">Créée le</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Livreur</th>
                <th className="border border-gray-300 px-4 py-2">Mise à jour le</th>
              </tr>
            </thead>
            <tbody>
              {archivedOrders.map(order => (
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
                  <td className="border border-gray-300 px-4 py-2">{order.status}</td>
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
      {showArchived && archivedOrders.length === 0 && (
        <p className="text-gray-500">Aucune commande livrée.</p>
      )}
    </div>
  );
};

export default ArchivedOrders;
