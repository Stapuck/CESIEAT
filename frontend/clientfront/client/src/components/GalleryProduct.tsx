import { useState, useEffect } from 'react';
import axios from 'axios'
import Product from './Product';
import Search from './Search';

function GalleryProduct() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const itemsPerPage = 6; // Nombre d'éléments par page

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3002/api/products");
      setProducts(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getProducts();
  }, [])

  // Calcul des produits à afficher
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

  // Calcul des numéros de page
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className=''>
      <Search />
      <div className=''>
        <h1 className='text-3xl font-bold text-start p-3 ml-4 mt-5 mb-5'>Nos restaurants à proximtés</h1>
      </div>
      
      <div className='grid grid-cols-1 bg-white rounded-2xl m-5 lg:grid-cols-3 sm:grid-cols-2 xl:grid-cols-3  mt-5'>

        {isLoading ? ("Loading") : (
          <>
            {currentProducts.length > 0 ? (
              <>
                {
                  currentProducts.map((product, index) => {
                    return (
                      <Product key={index} product={product} getProducts={getProducts} />

                    )
                  })
                }
              </>
            ) : (

              <div>
                There is no products
              </div>
            )}

          </>
        )}


      </div>

      {/* Pagination */}
      <div className="flex justify-center my-4 ">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-4 py-2 mx-1 rounded hover:cursor-pointer hover:scale-110 transition-transform duration-200 ${
              currentPage === number
                ? "bg-text-search-color text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {number}
          </button>
        ))}
      </div>
    </div>
  );
}

export default GalleryProduct;