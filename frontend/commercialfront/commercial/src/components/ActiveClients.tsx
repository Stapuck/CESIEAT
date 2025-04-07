import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { Client } from './ClientList';

const ActiveClients: React.FC<{
  clients: Client[];
  selectedClients: string[];
  setSelectedClients: React.Dispatch<React.SetStateAction<string[]>>;
  handleBulkAction: (action: 'suspend' | 'delete') => void;
}> = ({ clients, selectedClients, setSelectedClients, handleBulkAction }) => {
  const fetchClientDetails = async (clientId: string): Promise<Client | null> => {
    try {
      const response = await fetch(`https://localhost/api/clients/${clientId}`);
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
            <p><strong>Date de création :</strong> ${new Date(client.createdAt).toLocaleString()}</p>
            <p><strong>Dernière MàJ :</strong> ${new Date(client.updatedAt).toLocaleString()}</p>
          </div>
        `,
        icon: 'info',
        showConfirmButton: true,
        confirmButtonText: 'Fermer',
      });
    }
  };

  const handleEditClient = async (clientId: string) => {
    const client = await fetchClientDetails(clientId);
    if (client) {
      Swal.fire({
        title: 'Modifier les informations :',
        html: `
          <div style="text-align: left;">
            <div>
              <label>Nom :</label>
              <input id="edit-name" type="text" value="${client.name}" class="swal2-input" />
            </div>
            <div>
              <label>Email :</label>
              <input id="edit-email" type="email" value="${client.email}" class="swal2-input" />
            </div>
            <div>
              <label>Adresse :</label>
              <input id="edit-address" type="text" value="${client.address}" class="swal2-input" />
            </div>
            <div>
              <label>Téléphone :</label>
              <input id="edit-phone" type="text" value="${client.phone}" class="swal2-input" />
            </div>
          </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Sauvegarder',
        cancelButtonText: 'Annuler',
        preConfirm: () => {
          const name = (document.getElementById('edit-name') as HTMLInputElement).value;
          const email = (document.getElementById('edit-email') as HTMLInputElement).value;
          const address = (document.getElementById('edit-address') as HTMLInputElement).value;
          const phone = (document.getElementById('edit-phone') as HTMLInputElement).value;

          if (!name || !email || !address || !phone) {
            Swal.showValidationMessage('Tous les champs doivent être remplis.');
          }

          return { ...client, name, email, address, phone };
        },
      }).then(async result => {
        if (result.isConfirmed) {
          try {
            const response = await fetch(`https://localhost/api/clients/${clientId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(result.value),
            });
            if (!response.ok) throw new Error('Failed to update client');
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'Client modifié avec succès.',
              showConfirmButton: false,
              timer: 3000,
            });
          } catch {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'error',
              title: 'Erreur',
              text: 'Impossible de modifier le client.',
              showConfirmButton: false,
              timer: 3000,
            });
          }
        }
      });
    }
  };

  return (
    <div>
      <h2 className="flex justify-between items-center mb-4 text-lg font-bold">Comptes Actifs</h2>
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => handleBulkAction('suspend')}
          className={`px-4 py-2 rounded ${
            selectedClients.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-yellow-500 text-white cursor-pointer'
          }`}
          disabled={selectedClients.length === 0}
        >
          Suspendre
        </button>
        <button
          onClick={() => handleBulkAction('delete')}
          className={`px-4 py-2 rounded ${
            selectedClients.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-red-500 text-white cursor-pointer'
          }`}
          disabled={selectedClients.length === 0}
        >
          Supprimer
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
            <button
              onClick={() => handleEditClient(client._id)}
              className="bg-blue-500 text-white px-2 py-1 rounded cursor-pointer"
            >
              Modifier
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveClients;
