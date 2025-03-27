import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'; 
// import { VITE_BACKEND_URL_PRODUCT } from "../App";


interface IProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

const Product = ({ product, getProducts}: { product: IProduct; getProducts: () => void}) => {

    const deleteProduct = async (id : string) => {
        const result = await Swal.fire({
            title: "really delete the product ?", 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Yes, Delete it !'
        })
        if (result.isConfirmed){

            try {
                await axios.delete(`http://localhost:3002/api/products/${id}`)
                // await axios.delete(`${VITE_BACKEND_URL_PRODUCT}/api/products/${id}`)
                toast.success("Delete a product sucessfully")
                getProducts()
                
            } catch (error : any) {
                toast.error(error.message)
            }
        }   
    }

    return (
        <div className="bg-white rounded shadow-lg overflow-hidden m-3">
            <img src={product.image} alt={product.name} className="w-full h-28 object-cover" />
            <div className="px-4 pt-2 pb-4">
                <h2 className="text font-semibold">
                {product.name}
                </h2>
                <div className="text-sm">Quantity : {product.quantity} </div>
                <div className="text-sm">Price : {product.price} </div>
                <div className="mt-2 flex gap-4 ">
                    <Link to={`/edit-product/${product._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounderd-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer ">edit</Link>
                    <button onClick={()=>deleteProduct(product._id)} className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounderd-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer ">delete</button>
                </div>
            </div>
        </div>
    );
}

export default Product;
