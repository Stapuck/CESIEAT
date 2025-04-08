import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ActiveClients from './ActiveClients';
import SuspendedClients from './SuspendedClients';

export interface Client {
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
  const [selectedActiveClients, setSelectedActiveClients] = useState<string[]>([]);
  const [selectedSuspendedClients, setSelectedSuspendedClients] = useState<string[]>([]);
  const [sortOrder, setSortClient] = useState<'asc' | 'desc'>('desc');
  const [showSuspended, setShowSuspended] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Pagination for active accounts
  const [activeItemsPerPage, setActiveItemsPerPage] = useState<number>(25);
  const [activeCurrentPage, setActiveCurrentPage] = useState<number>(1);

  // Pagination for suspended accounts
  const [suspendedItemsPerPage, setSuspendedItemsPerPage] = useState<number>(25);
  const [suspendedCurrentPage, setSuspendedCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('https://localhost/api/clients');
        if (!response.ok) throw new Error('Failed to fetch clients');
        const data = await response.json();
        setClients(data);
      } catch {
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Erreur',
          text: 'Impossible de charger les clients.',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    };

    fetchClients();
  }, []);

  const handleBulkAction = async (action: 'suspend' | 'delete' | 'unsuspend') => {
    const selectedClients =
      action === 'unsuspend' ? selectedSuspendedClients : selectedActiveClients;

    try {
      const result = await Swal.fire({
        title: `Êtes-vous sûr de vouloir ${action === 'suspend' ? 'suspendre' : action === 'delete' ? 'supprimer' : 'réactiver'} les utilisateurs sélectionnés ?`,
        text: action === 'delete' ? 'Cette action est irréversible.' : '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: action === 'delete' ? '#d33' : '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
      });

      if (result.isConfirmed) {
        const promises = selectedClients.map(clientId => {
          const client = clients.find(c => c._id === clientId);
          if (action === 'suspend') {
            return fetch(`https://localhost/api/clients/${clientId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...client, isPaused: true }),
            });
          } else if (action === 'unsuspend') {
            return fetch(`https://localhost/api/clients/${clientId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...client, isPaused: false }),
            });
          } else if (action === 'delete') {
            return fetch(`https://localhost/api/clients/${clientId}`, { method: 'DELETE' });
          }
        });

        await Promise.all(promises);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Succès',
          text:
            action === 'suspend'
              ? 'Les comptes sélectionnés ont été suspendus avec succès.'
              : action === 'unsuspend'
              ? 'Les comptes sélectionnés ont été réactivés avec succès.'
              : '',
          showConfirmButton: false,
          timer: 3000,
        });

        setClients(prev =>
          action === 'delete'
            ? prev.filter(client => !selectedClients.includes(client._id))
            : prev.map(client =>
                selectedClients.includes(client._id)
                  ? { ...client, isPaused: action === 'suspend' }
                  : client
              )
        );

        if (action === 'unsuspend') {
          setSelectedSuspendedClients([]);
        } else {
          setSelectedActiveClients([]);
        }
      }
    } catch {
      Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'action.',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedClients = [...filteredClients].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const activeClients = sortedClients.filter(client => !client.isPaused);
  const suspendedClients = sortedClients.filter(client => client.isPaused);

  const paginatedClients = (clients: Client[], itemsPerPage: number, currentPage: number) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return clients.slice(startIndex, endIndex);
  };

  const paginatedActiveClients = paginatedClients(activeClients, activeItemsPerPage, activeCurrentPage);
  const paginatedSuspendedClients = paginatedClients(suspendedClients, suspendedItemsPerPage, suspendedCurrentPage);

  return (
    <div>
      <div className="p-4 bg-white shadow rounded-lg mb-4">
        <input
          type="text"
          placeholder="Rechercher un compte client..."
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
          }}
          className="mb-4 p-2 border rounded w-full"
        />
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSortClient('asc');
              }}
              className={`px-4 py-2 rounded cursor-pointer ${sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Croissant
            </button>
            <button
              onClick={() => {
                setSortClient('desc');
              }}
              className={`px-4 py-2 rounded cursor-pointer ${sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Décroissant
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 bg-white shadow rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <label htmlFor="activeItemsPerPage" className="mr-2">Afficher les comptes actifs de 25, 50, 75, 100 dynamiquement :</label>
          <select
            id="activeItemsPerPage"
            value={activeItemsPerPage}
            onChange={e => setActiveItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded"
          >
            {[25, 50, 75, 100].filter(option => option <= activeClients.length || option === 25).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <ActiveClients
          clients={paginatedActiveClients}
          selectedClients={selectedActiveClients}
          setSelectedClients={setSelectedActiveClients}
          handleBulkAction={handleBulkAction}
        />
        {activeClients.length === 0 && (
          <p className="text-center text-gray-500 mt-4">Aucun compte actif disponible</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setActiveCurrentPage(prev => prev - 1)}
            className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${
              activeCurrentPage === 1 ? 'invisible' : ''
            }`}
            disabled={activeCurrentPage === 1}
          >
            Précédent
          </button>
          <span className="text-center flex-grow">Page {activeCurrentPage}</span>
          <button
            onClick={() => setActiveCurrentPage(prev => prev + 1)}
            className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${
              activeCurrentPage * activeItemsPerPage >= activeClients.length ? 'invisible' : ''
            }`}
            disabled={activeCurrentPage * activeItemsPerPage >= activeClients.length}
          >
            Suivant
          </button>
        </div>
      </div>
      <button
        onClick={() => setShowSuspended(!showSuspended)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mt-4 cursor-pointer"
      >
        {showSuspended ? 'Masquer les comptes suspendus' : 'Afficher les comptes suspendus'}
      </button>
      {showSuspended && (
        <>
          <div className="p-4 bg-white shadow rounded-lg">
            <div className="flex justify-between items-center mb-4">
              <label htmlFor="suspendedItemsPerPage" className="mr-2">Afficher les comptes suspendus de 25, 50, 75, 100 dynamiquement :</label>
              <select
                id="suspendedItemsPerPage"
                value={suspendedItemsPerPage}
                onChange={e => setSuspendedItemsPerPage(Number(e.target.value))}
                className="p-2 border rounded"
              >
                {[25, 50, 75, 100].filter(option => option <= suspendedClients.length || option === 25).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            <SuspendedClients
              clients={paginatedSuspendedClients}
              selectedClients={selectedSuspendedClients}
              setSelectedClients={setSelectedSuspendedClients}
              handleBulkAction={handleBulkAction}
            />
            {suspendedClients.length === 0 && (
              <p className="text-center text-gray-500 mt-4">Aucun compte suspendu disponible</p>
            )}
            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setSuspendedCurrentPage(prev => prev - 1)}
                className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${
                  suspendedCurrentPage === 1 ? 'invisible' : ''
                }`}
                disabled={suspendedCurrentPage === 1}
              >
                Précédent
              </button>
              <span className="text-center flex-grow">Page {suspendedCurrentPage}</span>
              <button
                onClick={() => setSuspendedCurrentPage(prev => prev + 1)}
                className={`px-4 py-2 bg-gray-300 rounded cursor-pointer ${
                  suspendedCurrentPage * suspendedItemsPerPage >= suspendedClients.length ? 'invisible' : ''
                }`}
                disabled={suspendedCurrentPage * suspendedItemsPerPage >= suspendedClients.length}
              >
                Suivant
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClientList;
