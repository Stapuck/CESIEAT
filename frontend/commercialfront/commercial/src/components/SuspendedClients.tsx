import React from 'react';
import Swal from 'sweetalert2';
import { Client } from './ClientList';

const SuspendedClients: React.FC<{
  clients: Client[];
  selectedClients: string[];
  setSelectedClients: React.Dispatch<React.SetStateAction<string[]>>;
  handleBulkAction: (action: 'unsuspend') => void;
}> = ({ clients, selectedClients, setSelectedClients, handleBulkAction }) => {
  const fetchClientDetails = async (clientId: string): Promise<Client | null> => {
    try {
      const response = await fetch(`https://cesieat.nathan-lorit.com/api/clients/${clientId}`);
      if (!response.ok) throw new Error('Failed to fetch client details');
      return await response.json();
    } catch {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails du client.',
        showConfirmButton: false,
        timer: 3000,
      });
      return null;
    }
  };

  const handleViewDetails = async (clientId: string) => {
    const client = await fetchClientDetails(clientId);
    if (client) {
      Swal.fire({
        title: 'Détails du Client',
        html: `
          <div style="text-align: left;">
            <p><strong>Nom :</strong> ${client.name}</p>
            <p><strong>Email :</strong> ${client.email}</p>
            <p><strong>Adresse :</strong> ${client.address}</p>
            <p><strong>Téléphone :</strong> ${client.phone}</p>
            <p><strong>Créé le :</strong> ${new Date(client.createdAt).toLocaleString()}</p>
            <p><strong>Mis à jour le :</strong> ${new Date(client.updatedAt).toLocaleString()}</p>
          </div>
        `,
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Fermer',
      });
    }
  };

  return (
    <div>
      <h2 className="flex justify-between items-center mb-4 text-lg font-bold">Comptes Suspendus</h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleBulkAction('unsuspend')}
          className={`px-4 py-2 rounded ${
            selectedClients.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-500 text-white cursor-pointer'
          }`}
          disabled={selectedClients.length === 0}
        >
          Réactiver
        </button>
      </div>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client._id} className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedClients.includes(client._id)}
                onChange={() =>
                  setSelectedClients(prev =>
                    prev.includes(client._id) ? prev.filter(id => id !== client._id) : [...prev, client._id]
                  )
                }
              />
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => handleViewDetails(client._id)}
              >
                {client.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SuspendedClients;
