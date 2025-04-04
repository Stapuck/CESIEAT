import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaPen, FaTrash, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
// import { Accordion, AccordionItem } from "@/components/ui/accordion";

interface IRestaurateur {
  _id: string;
  position: [number, number];
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  url_image: string;
  managerId_Zitadel: string;
}

const Account = () => {
  const auth = useAuth();
  const roles = auth.user?.profile["urn:zitadel:iam:org:project:roles"];
  const roleEntries = roles ? Object.entries(roles) : [];

  const [restaurant, setRestaurant] = useState<IRestaurateur | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getRestaurateurByManagerId = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `http://localhost:8080/api/restaurateurs/manager/${auth.user?.profile.sub}`
      );
      setRestaurant(response.data.length > 0 ? response.data[0] : null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (restaurant) {
      try {
        await axios.put(
          `http://localhost:8080/api/restaurateurs/${restaurant._id}`,
          restaurant
        );
        setIsEditing(false);
        toast.success("Information sauvegarder avec succès");
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handlesuppression = async () => {
    const result = await Swal.fire({
      title: "really delete your restaurant ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Delete it !",
    });
    if (result.isConfirmed) {
      if (restaurant) {
        try {
          await axios.delete(
            `http://localhost:8080/api/restaurateurs/${restaurant._id}`
          );
        } catch (error: any) {
          // console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  useEffect(() => {
    getRestaurateurByManagerId();
  }, []);

  return (
    <div className="p-6 pt-20 mt-25 mr-40 flex justify-between">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl pb-3 font-semibold text-center">Mon Profil Restaurateur</h1>
        <div className="space-y-2">
          <p className="text-gray-700">
            <strong>Email :</strong> {auth.user?.profile.email}
          </p>
          <p className="text-gray-700">
            <strong>ID utilisateur :</strong> {auth.user?.profile.sub}
          </p>
          <p className="text-gray-700">
            <strong>Nom :</strong> {auth.user?.profile.family_name}
          </p>
          <p className="text-gray-700">
            <strong>Prénom :</strong> {auth.user?.profile.given_name}
          </p>
        </div>
        <div className="mt-4">
          <p className="font-semibold text-gray-800">Rôles :</p>
          {roleEntries.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {roleEntries.map(([role, value]) => (
                <li key={value}>{role}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun rôle trouvé</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-center">Votre Restaurant</h1>
          {isLoading ? null : restaurant && (
            <div className="space-x-4">
              {isEditing ? (
                <button onClick={handleSave} className="bg-green-600 rounded p-2 text-white">
                  <FaSave className="inline mx-1" /> 
                </button>
              ) : (
                <button onClick={handleEdit} className="bg-blue-600 rounded p-2 text-white">
                  <FaPen className="inline mx-1" /> 
                </button>
              )}
              <button onClick={handlesuppression} className="bg-red-600 p-2 rounded text-white">
                <FaTrash className="inline mx-1 " />
              </button>
            </div>
          )}
        </div>
        {isLoading ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : restaurant ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={restaurant.url_image}
                alt="Restaurant"
                className="w-full h-64 object-cover rounded-lg shadow-md mb-4"
              />
              <div className="w-full space-y-4">
                <div>
                  <strong className="block text-sm text-gray-600">
                    URL de l'image :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.url_image}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, url_image: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div className="hidden">
                  <strong className="block text-sm text-gray-600">
                    ID Restaurant :
                  </strong>
                  <input
                    type="text"
                    value={restaurant._id}
                    readOnly={true}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <strong className="block text-sm text-gray-600">
                    Manager :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.managerName}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        managerName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <strong className="block text-sm text-gray-600">
                    Email :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.email}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, email: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <strong className="block text-sm text-gray-600">
                    Nom du Restaurant :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.restaurantName}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({
                        ...restaurant,
                        restaurantName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <strong className="block text-sm text-gray-600">
                    Adresse :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.address}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, address: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
                <div>
                  <strong className="block text-sm text-gray-600">
                    Téléphone :
                  </strong>
                  <input
                    type="text"
                    value={restaurant.phone}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, phone: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Aucun restaurant associé.</p>
            <Link
              to="/restaurateur/create-restaurant"
              className="mt-4 bg-blue-500 text-white py-2 px-6 rounded-lg shadow hover:bg-blue-600 transition"
            >
              Créer un restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
