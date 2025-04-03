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
  managerName: string;
  email: string;
  restaurantName: string;
  address: string;
  phone: string;
  name: string;
  position: [number, number];
  url: string;
  managerId: string;
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
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold">Account</h2>
        <p>
          <strong>Email :</strong> {auth.user?.profile.email}
        </p>
        <p>
          <strong>ID utilisateur :</strong> {auth.user?.profile.sub}
        </p>
        <p>
          <strong>Nom :</strong> {auth.user?.profile.family_name}
        </p>
        <p>
          <strong>Prénom :</strong> {auth.user?.profile.given_name}
        </p>
        <p className="mt-4 font-semibold">Rôles :</p>
        {roleEntries.length > 0 ? (
          <ul className="list-disc list-inside">
            {roleEntries.map(([role, value]) => (
              <li key={value} className="text-gray-600">
                {role}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun rôle trouvé</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto mt-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold text-center">
            Votre Restaurant
          </h1>
          {isLoading ? (
            <></>
          ) : (
            <>
              {restaurant ? (
                <>
                  <div className="space-x-4">
                    {isEditing ? (
                      <>
                        <button onClick={handleSave}>
                          <FaSave className="inline mr-2 text-black" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={handleEdit}>
                          <FaPen className="inline mr-2 text-black" />
                        </button>
                      </>
                    )}
                    <button onClick={handlesuppression}>
                      <FaTrash className="inline mr-2 text-black" />
                    </button>
                  </div>
                </>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
        {isLoading ? (
          <p className="text-gray-500 text-center">Chargement...</p>
        ) : restaurant ? (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <img
                src={restaurant.url}
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
                    value={restaurant.url}
                    readOnly={!isEditing}
                    onChange={(e) =>
                      setRestaurant({ ...restaurant, url: e.target.value })
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
