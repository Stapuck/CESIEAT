import React, { useState, useEffect } from 'react';
import ActiveOrders from '../components/ActiveOrders';
import ArchivedOrders from '../components/ArchivedOrders';
import Swal from 'sweetalert2';

export interface Order {
  _id: string;
  clientId_Zitadel: string;
  livreurId_Zitadel: string;
  restaurantId: string;
  menuId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  clientId_Zitadel: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  isPaused: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Livreur {
  _id: string;
  livreurId_Zitadel: string;
  name: string;
  email: string;
  phone: string;
  vehicleType: string;
  codeLivreur: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

interface IRestaurateur {
  _id: string;
  managerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  phone: string;
  name: string;
  position: [number, number];
  url: string;
  createdAt: string;
  updatedAt: string;
}

interface Menu {
  name: string;
  price: number;
  articles: Article[];
  restaurateurId: string;
  url_image: string;
}

interface Article extends Document {
  name: string;
  reference: string;
  price: number;
  url_image: string;
  articleId: string;

}

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [restaurants, setRestaurants] = useState<IRestaurateur[]>([]);
  const [livreurs, setLivreurs] = useState<Livreur[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchCriteria, setSearchCriteria] = useState<string>('commande');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [itemsPerPage, setItemsPerPage] = useState<{ [key: string]: number }>({});
  const [currentPage, setCurrentPage] = useState<{ [key: string]: number }>({});
  const [archivedItemsPerPage, setArchivedItemsPerPage] = useState<number>(10);
  const [archivedCurrentPage, setArchivedCurrentPage] = useState<number>(1);
  error && console.error('Error fetching data:', error);

  useEffect(() => {
    const fetchData = async (endpoint: string, setter: React.Dispatch<any>, errorSetter?: React.Dispatch<any>) => {
      try {
        const response = await fetch(`https://cesieat.nathan-lorit.com/api/${endpoint}`);
        if (!response.ok) throw new Error(`Failed to fetch ${endpoint}`);
        const data = await response.json();
        setter(data);
      } catch (err :any) {
        if (errorSetter) errorSetter(err.message);
      }
    };

    fetchData('commandes', setOrders, setError);
    fetchData('clients', setClients);
    fetchData('restaurateurs', setRestaurants);
    fetchData('livreurs', setLivreurs);
    fetchData('menus', setMenus);
    fetchData('articles', setArticles);
  }, []);

  useEffect(() => {
    const initialItemsPerPage = statuses.reduce((acc, status) => ({ ...acc, [status]: 5 }), {});
    const initialCurrentPage = statuses.reduce((acc, status) => ({ ...acc, [status]: 1 }), {});
    setItemsPerPage(initialItemsPerPage);
    setCurrentPage(initialCurrentPage);
  }, []);

  const getName = (id: string, list: any[], key: string) => {
    const item = list.find(
      (i) => i._id === id || i.clientId_Zitadel === id || i.livreurId_Zitadel === id
    );
    return item ? item[key] : '/Err\\';
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const handleViewClientDetails = async (clientId: string) => {
    try {
      const response = await fetch(`https://cesieat.nathan-lorit.com/api/clients`);
      if (!response.ok) throw new Error('Failed to fetch client details');
      const clients = await response.json();

      const client = clients.find((c: any) => c.clientId_Zitadel === clientId);
      if (!client) {
        throw new Error(`Client with clientId_Zitadel ${clientId} not found`);
      }

      Swal.fire({
        title: 'Détails du Client',
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;"><p><strong>Nom et prénom :</strong> ${client.name}</p>
            <p><strong>Email :</strong> ${client.email}</p>
            <p><strong>Téléphone :</strong> ${client.phone}</p>
            <p><strong>Adresse :</strong> ${client.address}</p>
            <p><strong>Statut :</strong> ${client.isPaused ? 'Suspendu' : 'Actif'}</p>
            <p><strong>Date de création :</strong> ${formatDateTime(client.createdAt)}</p>
            <p><strong>Dernière MàJ :</strong> ${formatDateTime(client.updatedAt)}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de charger les détails du client. Veuillez contacter votre administrateur.', 'error');
    }
  };

  const handleViewRestaurantDetails = (restaurantId: string) => {
    const restaurant = restaurants.find(r => r._id === restaurantId);
    if (restaurant) {
      Swal.fire({
        title: 'Détails du Restaurant',
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;">
            <p><strong>Nom :</strong> ${restaurant.restaurantName}</p>
            <p><strong>Manager :</strong> ${restaurant.managerName}</p>
            <p><strong>Email :</strong> ${restaurant.email}</p>
            <p><strong>Adresse :</strong> ${restaurant.address}</p>
            <p><strong>Téléphone :</strong> ${restaurant.phone}</p>
            <p><strong>Date de création :</strong> ${formatDateTime(restaurant.createdAt)}</p>
            <p><strong>Dernière MàJ :</strong> ${formatDateTime(restaurant.updatedAt)}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } else {
      Swal.fire('Erreur', 'Impossible de charger les détails du restaurant. Veuillez contacter votre administrateur.', 'error');
    }
  };

  const handleViewLivreurDetails = async (livreurId: string) => {
    try {
      const response = await fetch(`https://cesieat.nathan-lorit.com/api/livreurs`);
      if (!response.ok) throw new Error('Failed to fetch livreur details');
      const livreurs = await response.json();

      const livreur = livreurs.find((c: any) => c.livreurId_Zitadel === livreurId);
      if (!livreur) {
        throw new Error(`Client with livreurId_Zitadel ${livreurId} not found`);
      }

      Swal.fire({
        title: 'Détails du Livreur',
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;">
            <p><strong>Nom et prénom :</strong> ${livreur.name}</p>
            <p><strong>Email :</strong> ${livreur.email}</p>
            <p><strong>Téléphone :</strong> ${livreur.phone}</p>
            <p><strong>Type de véhicule :</strong> ${livreur.vehicleType}</p>
            <p><strong>Code livreur :</strong> ${livreur.codeLivreur}</p>
            <p><strong>Disponibilité :</strong> ${livreur.isAvailable ? 'Oui' : 'Non'}</p>
            <p><strong>Date de création :</strong> ${formatDateTime(livreur.createdAt)}</p>
            <p><strong>Dernière MàJ :</strong> ${formatDateTime(livreur.updatedAt)}</p>
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de charger les détails du livreur. Veuillez contacter votre administrateur.', 'error');
    }
  };

  const handleViewOrderDetails = (order: any) => {
    try {
      const menu = menus.find((m: any) => m._id === order.menuId);
      const client = clients.find((c: any) => c.clientId_Zitadel === order.clientId_Zitadel);
      const livreur = livreurs.find((l: any) => l.livreurId_Zitadel === order.livreurId_Zitadel);
      const articleNames = menu?.articles
        ?.map((articleId: any) => {
          const article = articles.find((a: any) => a._id === articleId);
          return article ? article.name : 'Article introuvable';
        })
        .join(', ');

      Swal.fire({
        title: `Détails de la Commande #${order._id.slice(-6)}`,
        html: `
          <div style="text-align: left; margin: 0 auto; width: fit-content;">
            <p><strong>Client :</strong> ${client ? client.name : 'Client introuvable'}</p>
            <p><strong>Restaurant :</strong> ${getName(order.restaurantId, restaurants, 'restaurantName')}</p>
            <p><strong>Livreur :</strong> ${livreur ? livreur.name : 'Non assigné'}</p>
            <p><strong>Menu :</strong> ${menu ? menu.name : 'Non trouvé'}</p>
            <p><strong>Articles :</strong> ${articleNames || 'Aucun article'}</p>
            <p><strong>Prix Menu :</strong> ${menu ? menu.price + ' €' : 'N/A'}</p>
            <p><strong>Prix Total :</strong> ${order.totalAmount} €</p>
            <p><strong>Statut :</strong> ${order.status}</p>
            <p><strong>Date de création :</strong> ${formatDateTime(order.createdAt)}</p>
            <p><strong>Dernière MàJ :</strong> ${formatDateTime(order.updatedAt)}</p>
            ${
              menu && menu.url_image
                ? `<div style="display: flex; justify-content: center; margin-top: 10px;">
                    <img src="${menu.url_image}" alt="${menu.name}" style="max-width: 100px;" />
                  </div>`
                : ''
            }
          </div>
        `,
        confirmButtonText: 'Fermer',
      });
    } catch (err) {
      Swal.fire('Erreur', 'Impossible de charger les détails de la commande. Veuillez contacter votre administrateur.', 'error');
    }
  };

  const statuses = ['En attente', 'Préparation', 'Prêt', 'En livraison'];
  const filteredOrders = orders.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    let result = false;

    switch (searchCriteria) {
      case 'commande':
        result = order._id.includes(searchLower);
        break;
      case 'client':
        result = getName(order.clientId_Zitadel, clients, 'name').toLowerCase().includes(searchLower);
        break;
      case 'restaurant':
        result = getName(order.restaurantId, restaurants, 'restaurantName').toLowerCase().includes(searchLower);
        break;
      case 'statut':
        result = order.status.toLowerCase().includes(searchLower);
        break;
      case 'livreur':
        result = order.livreurId_Zitadel && getName(order.livreurId_Zitadel, livreurs, 'name').toLowerCase().includes(searchLower);
        break;
      default:
        result = false;
    }

    return result;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return sortOrder === 'asc' ? a.createdAt.localeCompare(b.createdAt) : b.createdAt.localeCompare(a.createdAt);
  });

  const filteredStatusOrders = (status: string) => {
    const result = sortedOrders.filter(order => order.status === status);
    return result;
  };

  const paginatedOrders = (orders: any[], status: string) => {
    const startIndex = (currentPage[status] - 1) * itemsPerPage[status];
    const endIndex = startIndex + itemsPerPage[status];
    return orders.slice(startIndex, endIndex);
  };

  const handleItemsPerPageChange = (status: string, value: number) => {
    setItemsPerPage(prev => ({ ...prev, [status]: value }));
    setCurrentPage(prev => ({ ...prev, [status]: 1 }));
  };

  const handlePageChange = (status: string, direction: 'prev' | 'next') => {
    setCurrentPage(prev => ({
      ...prev,
      [status]: direction === 'prev' ? prev[status] - 1 : prev[status] + 1,
    }));
  };

  const handleArchivedPageChange = (direction: 'prev' | 'next') => {
    setArchivedCurrentPage(prev => direction === 'prev' ? prev - 1 : prev + 1);
  };

  const archivedOrdersProps = {
    orders: sortedOrders,
    showArchived,
    setShowArchived,
    getName,
    clients,
    restaurants,
    livreurs,
    handleViewClientDetails,
    handleViewRestaurantDetails,
    handleViewLivreurDetails,
    handleViewOrderDetails,
    itemsPerPage: archivedItemsPerPage,
    handleItemsPerPageChange: setArchivedItemsPerPage,
    currentPage: archivedCurrentPage,
    handlePageChange: handleArchivedPageChange,
  };

  return (
    <>
      <div className="p-4 bg-white shadow rounded-lg mb-4">
        <div className="flex items-center mb-4">
          <select
            value={searchCriteria}
            onChange={e => setSearchCriteria(e.target.value)}
            className="mr-2 p-2 border rounded"
          >
            <option value="commande">Commande</option>
            <option value="client">Client</option>
            <option value="restaurant">Restaurant</option>
            <option value="statut">Statut</option>
            <option value="livreur">Livreur</option>
          </select>
          <input
            type="text"
            placeholder={`Rechercher par ${searchCriteria}...`}
            value={searchTerm}
            onChange={e => {
              setSearchTerm(e.target.value);
            }}
            className="flex-grow p-2 border rounded"
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSortOrder('asc');
              }}
              className={`px-4 py-2 rounded cursor-pointer ${sortOrder === 'asc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Croissant
            </button>
            <button
              onClick={() => {
                setSortOrder('desc');
              }}
              className={`px-4 py-2 rounded cursor-pointer ${sortOrder === 'desc' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
            >
              Décroissant
            </button>
          </div>
        </div>
      </div>
      {statuses.map(status => {
        const orders = filteredStatusOrders(status);
        const paginated = paginatedOrders(orders, status);

        if (orders.length === 0) {
          return null;
        }

        return (
          <div key={status} className="p-4 bg-white shadow rounded-lg mb-4">
            <ActiveOrders
              status={status}
              orders={paginated}
              getName={getName}
              clients={clients}
              restaurants={restaurants}
              livreurs={livreurs}
              handleViewLivreurDetails={handleViewLivreurDetails}
              handleViewClientDetails={handleViewClientDetails}
              handleViewRestaurantDetails={handleViewRestaurantDetails}
              handleViewOrderDetails={handleViewOrderDetails}
              itemsPerPage={itemsPerPage[status]}
              handleItemsPerPageChange={(value) => handleItemsPerPageChange(status, value)}
              currentPage={currentPage[status]}
              handlePageChange={(direction) => handlePageChange(status, direction)}
              totalOrders={orders.length}
            />
          </div>
        );
      })}
      {statuses.every(status => filteredStatusOrders(status).length === 0) && (
        <p className="text-gray-500">Aucune commande en cours</p>
      )}
      <ArchivedOrders {...archivedOrdersProps} />
    </>
  );
};

export default OrderList;
