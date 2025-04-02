// src/components/ClientList.tsx
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

interface Client {
  _id: string;
  name: string;
  email: string;
  address: string;
  phone: string;
  isPaused: boolean;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editClientData, setEditClientData] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch {
        Swal.fire('Erreur', 'Impossible de charger les clients.', 'error');
      }
    };
    fetchClients();
  }, []);

  const handleEditSubmit = async (updatedClient: Client) => {
    try {
      const response = await fetch(`http://localhost:8080/api/clients/${updatedClient._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedClient),
      });
      if (!response.ok) throw new Error('Failed to update client');
      const client = await response.json();
      Swal.fire('Succès', 'Client modifié avec succès.', 'success');
      setClients(prev => prev.map(c => (c._id === client._id ? client : c)));
      setEditClientData(null);
    } catch {
      Swal.fire('Erreur', 'Impossible de modifier le client.', 'error');
    }
  };

  const handleSuspend = async (client: Client) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr de vouloir suspendre cet utilisateur ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      await handleEditSubmit({ ...client, isPaused: true });
    }
  };

  const handleDelete = async (clientId: string) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr de vouloir supprimer cet utilisateur ?',
      text: 'Cette action est irréversible.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:8080/api/clients/${clientId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete client');
        Swal.fire('Succès', 'Client supprimé avec succès.', 'success');
        setClients(prev => prev.filter(client => client._id !== clientId));
      } catch {
        Swal.fire('Erreur', 'Impossible de supprimer le client.', 'error');
      }
    }
  };

  const closePopup = () => {
    setSelectedClient(null);
    setEditClientData(null);
  };

  return (
    <div>
      <ul className="space-y-2">
        {clients.map(client => (
          <li key={client._id} className="flex justify-between items-center">
            <span
              className="cursor-pointer text-blue-500"
              onClick={() => setSelectedClient(client)}
            >
              {client.name}
            </span>
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                onClick={() => setEditClientData(client)}
              >
                Modifier
              </button>
              <button
                className="bg-yellow-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                onClick={() => handleSuspend(client)}
              >
                Suspendre
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                onClick={() => handleDelete(client._id)}
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Détails des Clients</h4>
            <p><strong>Nom :</strong> {selectedClient.name}</p>
            <p><strong>Email :</strong> {selectedClient.email}</p>
            <p><strong>Addresse :</strong> {selectedClient.address}</p>
            <p><strong>Téléphone :</strong> {selectedClient.phone}</p>
            <p>
              <strong>Status :</strong> {selectedClient.isPaused ? 'Paused' : 'Active'}
            </p>
            <button
              className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:cursor-pointer"
              onClick={closePopup}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {editClientData && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Modifier le Client</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium">Nom</label>
                <input
                  type="text"
                  value={editClientData.name}
                  onChange={e => setEditClientData({ ...editClientData, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Email</label>
                <input
                  type="email"
                  value={editClientData.email}
                  onChange={e => setEditClientData({ ...editClientData, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Addresse</label>
                <input
                  type="text"
                  value={editClientData.address}
                  onChange={e => setEditClientData({ ...editClientData, address: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Téléphone</label>
                <input
                  type="text"
                  value={editClientData.phone}
                  onChange={e => setEditClientData({ ...editClientData, phone: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:cursor-pointer"
                onClick={closePopup}
              >
                Annuler
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:cursor-pointer"
                onClick={() => handleEditSubmit(editClientData)}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientList;
