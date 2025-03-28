import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'; 

interface IMenu {
    _id: string;
    name: string;
    price: number;
    articles: string[]; 
    createdAt: string;
}

// revoir la date TODO 

const MenuCard = ({ menu, getMenus }: { menu: IMenu; getMenus: () => void }) => {
    const deleteMenu = async (id: string) => {
        const result = await Swal.fire({
            title: "Voulez-vous vraiment supprimer ce menu ?", 
            icon: 'warning', 
            showCancelButton: true, 
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui, supprimer !"
        });
        
        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3006/api/menus/${id}`);
                toast.success("Menu supprimé avec succès");
                getMenus();
            } catch (error: any) {
                toast.error(error.message);
            }
        }   
    };

    return (
        <div>
            <div  className="bg-white rounded shadow-lg overflow-hidden m-3 p-4">
                <h2 className="text-lg font-semibold">{menu.name}</h2>
                <div className="text-sm">Prix : {menu.price} €</div>
                <div className="text-sm">Articles associés : {menu.articles.length}</div>
                <div className="text-sm">creer le  : {new Date(menu.createdAt).toLocaleString()}</div>
                <div className="mt-2 flex gap-4">
                    <Link to={`/edit-menu/${menu._id}`} className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer">
                        Modifier
                    </Link>
                    <button onClick={() => deleteMenu(menu._id)} className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer">
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MenuCard;
