import { useState, useEffect } from 'react';
import axios from 'axios';
import Restaurant from '../restaurantsComponents/Restaurant';
import Search from '../Search';
import { Link } from 'react-router-dom';

// Interface pour définir la structure d'un restaurant
interface IRestaurantData {
  _id: string;
  name: string;
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  position: [number, number];
  url: string;
}

function GalleryRestaurants() {
  const [restaurants, setRestaurants] = useState<IRestaurantData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Nombre d'éléments par page

  const getRestaurants = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3001/api/restaurateurs");
      setRestaurants(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getRestaurants();
  }, []);

  // Calcul des restaurants à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRestaurants = restaurants.slice(indexOfFirstItem, indexOfLastItem);

  // Calcul des numéros de page
  const totalPages = Math.ceil(restaurants.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className=''>
      <Search />
      <div className=''>
        <h1 className='text-3xl font-bold text-start p-3 ml-4 mt-5 mb-5'>Nos restaurants à proximité</h1>
      </div>

      <Link to="/create-restaurant">
        <button className="bg-text-search-color text-white px-4 py-2 rounded-lg ml-5 hover:bg-blue-700 transition duration-300">
          Ajouter un restaurant
        </button>
      </Link>

      <div className='grid grid-cols-1 bg-white rounded-2xl m-5 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3 mt-5'>
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center p-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-text-search-color"></div>
          </div>
        ) : (
          <>
            {currentRestaurants.length > 0 ? (
              <>
                {currentRestaurants.map((restaurant) => (
                  <div key={restaurant._id} className="p-4">
                    <Restaurant
                      id={restaurant._id}
                      name={restaurant.restaurantName || restaurant.name}
                      address={restaurant.address}
                      ville={restaurant.address.split(',').pop()?.trim() || ''}
                      phone={restaurant.phone}
                      url={restaurant.url}
                      position={restaurant.position}
                      onDelete={getRestaurants}  // Pour rafraîchir la liste après suppression
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="col-span-full text-center p-10">
                Aucun restaurant trouvé
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => handlePageChange(number)}
              className={`px-4 py-2 mx-1 rounded hover:cursor-pointer hover:scale-110 transition-transform duration-200 ${currentPage === number
                  ? "bg-text-search-color text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {number}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default GalleryRestaurants;