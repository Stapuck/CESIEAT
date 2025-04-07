import { useState, useEffect } from 'react';
import axios from 'axios'
import Product from './Product';

function GalleryProduct() {

    const [products, setProducts] = useState([]);

    const [isLoading, setIsLoading] = useState(false);
  
  
    const getProducts = async () => {
      try { 
        // console.log(VITE_BACKEND_URL);
        setIsLoading(true);
        const response = await axios.get("https://cesieat.com/api/products");
        // const response = await axios.get(`${VITE_BACKEND_URL_PRODUCT}/api/products`);
        // console.log(response.data);
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
  
    useEffect(()=> {
      getProducts();
    }, [])
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 mt-5'>
        {isLoading ? ("Loading") : (
          <>
          {products.length > 0 ? (
             <>
                {
                  products.map((product,index) => {
                    return (
                      <Product key={index} product={product} getProducts={getProducts}/>
                      
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
  );
}

export default GalleryProduct;