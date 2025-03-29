import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2';
// import { VITE_BACKEND_URL_PRODUCT } from "../App";

import FavoriteLogo from "../assets/icons/heart.fill.svg";


interface IProduct {
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

const Product = ({ product, getProducts }: { product: IProduct; getProducts: () => void }) => {

    const deleteProduct = async (id: string) => {
        const result = await Swal.fire({
            title: "really delete the product ?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: 'Yes, Delete it !'
        })
        if (result.isConfirmed) {

            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`)
                // await axios.delete(`${VITE_BACKEND_URL_PRODUCT}/api/products/${id}`)
                toast.success("Delete a product successfully");
                getProducts()

            } catch (error: any) {
                toast.error(error.message)
            }
        }
    }

    return (
        <div className=" bg-white flex  rounded-xl   m-3 z-10">
            <div className="p-1">
                <img src={product.image} alt={product.name} className=" w-[200px] h-[128px] overflow-clip object-cover " />
            </div>
            <div className="flex flex-col items-start mt-4 ml-3 justify-start">
                <h2 className="text font-semibold">
                    {product.name}
                </h2>
                <span className="text font-light italic">
                    {product.quantity} 
                </span>
                <span className="text font-normal ">
                    {product.price} €
                </span>
                <div className="mx-4">

                </div>
            </div>
            <div className="px-4 pt-2 pb-4">
                <div className="mt-2 flex flex-col gap-4 items-center ">
                    <Link to={`/edit-product/${product._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounderd-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer ">edit</Link>
                    <button onClick={() => deleteProduct(product._id)} className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounderd-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer ">delete</button>
                    <button className=""><img src={FavoriteLogo} className="w-10" /></button>
                </div>
            </div>
        </div>
    );
}

export default Product;
