import axios from 'axios';
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify';
// import { VITE_BACKEND_URL_PRODUCT } from '../App';

const EditPage = () => {
    let {id} = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [product, setProduct] = useState({
        name:"", 
        quantity:"", 
        price:"", 
        image:"",
    })

    const getProduct = async () => {
        setIsLoading(true);
        try {
        // const response = await axios.get(`${VITE_BACKEND_URL_PRODUCT}/api/products/${id}`);
        const response = await axios.get(`https://localhost/api/products/${id}`);
        setProduct({
            name: response.data.name, 
            quantity: response.data.quantity, 
            price:response.data.price, 
            image:response.data.image,
        })
        setIsLoading(false);
        } catch (error) {
            navigate('/404')
            setIsLoading(false);
            // toast.error(error.message);
        }   
    }

    const updateProduct = async (e: any) => {
        e.preventDefault(); 
        setIsLoading(true)
        try {
            // await axios.put(`${VITE_BACKEND_URL_PRODUCT}/api/products/${id}`, product); 
            await axios.put(`https://localhost/api/products/${id}`, product); 
            toast.success(`Update a product successfully`); 
            navigate('/'); 

        } catch (error : any) {
            setIsLoading(false);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProduct();
    }, [id])

  return (
    <div>
        <div className="max-w-lg bg-white shadow-lg mx-auto p-7 rounded mt-6"> 
            <h2 className="font-semibold text-2xl mb-2 block text-center">
                Update a Product 
            </h2>
            <h3 className='text-center font-semibold text-xl mb-4 block'>
            {product.name}
            </h3>
            {isLoading ? ("Loading") : (
                <>
                    <form onSubmit={updateProduct}>
                        <div className="space-y-2">
                            <div>
                                <label> Name </label>
                                <input type="text" value={product.name} onChange={(e) => setProduct({...product, name:e.target.value})} className="w-full block border p-3 text-slate-600 rounded focus outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" placeholder="Enter Name"/>
                            </div>
                        
                            <div>
                                <label> Quantity </label>
                                <input type="number" value={product.quantity}  onChange={(e) => setProduct({...product, quantity:e.target.value})} className="w-full block border p-3 text-slate-600 rounded focus outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" placeholder="Enter Quantity"/>
                            </div>
                            <div>
                                <label> Price </label>
                                <input type="number" value={product.price} onChange={(e) => setProduct({...product, price:e.target.value})} className="w-full block border p-3 text-slate-600 rounded focus outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" placeholder="Enter Price"/>
                            </div>
                            <div>
                                <label> Image URL  </label>
                                <input type="texte" value={product.image} onChange={(e) => setProduct({...product, image:e.target.value})}className="w-full block border p-3 text-slate-600 rounded focus outline-none focus:shadow-outline focus:border-blue-200 placeholder-gray-400" placeholder="Enter image url"/>
                                <div>
                                    <img src={product.image} alt={product.name} />
                                </div>
                            </div>

                            <div>
                                {!isLoading && (<button className="block w-full mt-6 bg-blue-700 text-white rounded-sm px-4 py-2 font-bold hover:bg-blue-600 hover:cursor-pointer">Update</button>) }
                            </div>
                        </div>
                    </form>
                </>
            )}
       </div>
    </div>
  )
}

export default EditPage