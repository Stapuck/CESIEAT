import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

interface IMenu {
  _id: string;
  name: string;
  price: number;
  articles: string[];
  createdAt: string;
  restaurateur: string;
}

const MenuCard = ({
  menu,
  getMenus,
}: {
  menu: IMenu;
  getMenus: () => void;
}) => {
  const deleteMenu = async (id: string) => {
    const result = await Swal.fire({
      title: "Voulez-vous vraiment supprimer ce menu ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, supprimer !",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://cesieat.com/api/menus/${id}`);
        toast.success("Menu supprimé avec succès");
        getMenus();
      } catch (error: any) {
        toast.error(error.message);
      }
    }
  };
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Date inconnue";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="transform hover:scale-105 transition duration-300">
      <div className="bg-white rounded shadow-lg overflow-hidden m-3 p-4">
        <h2 className="text-lg font-semibold">{menu.name}</h2>
        <div className="text-sm">Prix : {menu.price} €</div>
        <div className="text-sm">
          Articles associés : {menu.articles.length}
        </div>
        <div className="text-sm">Ajouter le {formatDate(menu.createdAt)}</div>
        <div className="mt-2 flex gap-4">
          <Link
            to={`/restaurateur/edit-menu/${menu._id}`}
            className="inline-block w-full text-center shadow-md text-sm bg-gray-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-gray-600 hover:cursor-pointer transform hover:scale-105 transition duration-300"
          >
            Modifier
          </Link>
          <button
            onClick={() => deleteMenu(menu._id)}
            className="inline-block w-full text-center shadow-md text-sm bg-red-700 text-white rounded-sm px-4 py-1 font-bold hover:bg-red-600 hover:cursor-pointer transform hover:scale-105 transition duration-300"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
