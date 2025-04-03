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
  createdAt: string;
  updatedAt: string;
}

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showSuspended, setShowSuspended] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>(''); // Add searchTerm state

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data); // Fetch all clients
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
      Swal.fire('Succès', 'Compte modifié avec succès.', 'success');
      setClients(prev => prev.map(c => (c._id === client._id ? client : c)));
    } catch {
      Swal.fire('Erreur', 'Impossible de modifier le compte.', 'error');
    }
  };

  const handleSuspend = async (client: Client) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr de vouloir suspendre cet utilisateur ?',
      text: 'Cette action suspendra l\'utilisateur.',
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

  const handleUnsuspend = async (client: Client) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr de vouloir réactiver cet utilisateur ?',
      text: 'Cette action réactivera l’utilisateur.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirmer',
      cancelButtonText: 'Annuler',
    });

    if (result.isConfirmed) {
      await handleEditSubmit({ ...client, isPaused: false });
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
        Swal.fire('Succès', 'Compte supprimé avec succès.', 'success');
        setClients(prev => prev.filter(client => client._id !== clientId));
      } catch {
        Swal.fire('Erreur', 'Impossible de supprimer le compte.', 'error');
      }
    }
  };

  const handleViewDetails = (client: Client) => {
    const formatDate = (dateString: string) => {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    };

    Swal.fire({
      title: 'Détails du Client',
      html: `
        <div style="text-align: left; margin: 0 auto; width: fit-content;">
          <p><strong>Nom :</strong> ${client.name}</p>
          <p><strong>Email :</strong> ${client.email}</p>
          <p><strong>Adresse :</strong> ${client.address}</p>
          <p><strong>Téléphone :</strong> ${client.phone}</p>
          <p><strong>Création du compte :</strong> ${formatDate(client.createdAt)}</p>
          <p><strong>Dernière connexion :</strong> ${formatDate(client.updatedAt)}</p>
          <p><strong>Status :</strong> ${client.isPaused ? 'Suspendu' : 'Actif'}</p>
        </div>
      `,
      confirmButtonText: 'Fermer',
    });
  };

  const handleEditClient = (client: Client) => {
    Swal.fire({
      title: 'Modifier les informations :',
      html: `
        <div class="space-y-4" style="text-align: left;">
          <div>
            <label class="block text-sm font-medium">Nom et prénom :</label>
            <input id="edit-name" type="text" value="${client.name}" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium">Email :</label>
            <input id="edit-email" type="email" value="${client.email}" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium">Adresse :</label>
            <input id="edit-address" type="text" value="${client.address}" class="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium">Téléphone :</label>
            <input id="edit-phone" type="text" value="${client.phone}" class="w-full border rounded px-3 py-2" />
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
        return { ...client, name, email, address, phone };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditSubmit(result.value as Client);
      }
    });
  };

  const renderSuspendedClients = () => {
    const suspendedClients = clients.filter(client => client.isPaused);

    return (
      <div className="mb-8">
        <button
          onClick={() => setShowSuspended(!showSuspended)}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          {showSuspended ? 'Masquer les comptes suspendus' : 'Afficher les comptes suspendus'}
        </button>
        {showSuspended && (
          <div>
            <h2 className="text-lg font-bold mb-4">Comptes Suspendus</h2>
            <ul className="space-y-2">
              {suspendedClients.length > 0 ? (
                suspendedClients.map(client => (
                  <li key={client._id} className="flex justify-between items-center">
                    <span className="text-gray-700">{client.name}</span>
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                      onClick={() => handleUnsuspend(client)}
                    >
                      Réactiver
                    </button>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Aucun compte suspendu.</li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Rechercher un utilisateur"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)} // Update searchTerm on change
        className="mb-4 p-2 border rounded w-full"
      />
      <h2 className="text-lg font-bold mb-4">Comptes Actifs</h2>
      <ul className="space-y-2">
        {clients
          .filter(client => 
            client.name.toLowerCase().includes(searchTerm.toLowerCase()) || // Filter by name
            client.email.toLowerCase().includes(searchTerm.toLowerCase())   // Filter by email
          )
          .filter(client => !client.isPaused)
          .map(client => (
            <li key={client._id} className="flex justify-between items-center">
              <span
                className="cursor-pointer text-blue-500"
                onClick={() => handleViewDetails(client)}
              >
                {client.name}
              </span>
              <div className="flex space-x-2">
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:cursor-pointer"
                  onClick={() => handleEditClient(client)}
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

      {renderSuspendedClients()}
    </div>
  );
};

export default ClientList;