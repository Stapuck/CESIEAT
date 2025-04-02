// import axios from "axios";
// import { useEffect, useState } from "react";
// import { useAuth } from "react-oidc-context";
// import { Link } from "react-router-dom";

// interface IRestaurateur {
//   managerName: string;
//   email: string;
//   restaurantName: string;
//   address: string;
//   phone: string;
//   name: string;
//   position: [number, number];
//   url: string;
//   managerId: string;
// }

// const Account = () => {
//   const auth = useAuth();
//   const roles = auth.user?.profile["urn:zitadel:iam:org:project:roles"];
//   const roleEntries = roles ? Object.entries(roles) : [];
  
//   const [restaurant, setRestaurant] = useState<IRestaurateur | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const getRestaurateurByManagerId = async () => {
//     try {
//       setIsLoading(true);
//    const response = await axios.get(`http://localhost:3001/api/restaurateurs/manager/${auth.user?.profile.sub}`);
//       // const response = await axios.get(`http://localhost:3001/api/restaurateurs/manager/312904774608685`);
//       setRestaurant(response.data.length > 0 ? response.data[0] : null);
//     } catch (error) {
//       console.log(error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     getRestaurateurByManagerId();
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h2 className="text-2xl font-semibold">Account</h2>
//         <p><strong>Email :</strong> {auth.user?.profile.email}</p>
//         <p><strong>ID utilisateur :</strong> {auth.user?.profile.sub}</p>
//         <p><strong>Nom :</strong> {auth.user?.profile.family_name}</p>
//         <p><strong>Prénom :</strong> {auth.user?.profile.given_name}</p>
//         <p className="mt-4 font-semibold">Rôles :</p>
//         {roleEntries.length > 0 ? (
//           <ul className="list-disc list-inside">
//             {roleEntries.map(([role, value]) => (
//               <li key={value} className="text-gray-600">{role}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>Aucun rôle trouvé</p>
//         )}
//       </div>

//       <div className="bg-white shadow-lg rounded-lg p-6">
//         <h1 className="text-2xl font-semibold">Votre restaurant</h1>
//         {isLoading ? (
//           <p className="text-gray-500">Chargement...</p>
//         ) : restaurant ? (
//           <div className="space-y-4">
//             {/* <p><strong>Manager :</strong> {restaurant.managerName === auth.user?.profile.given_name ? <div>{restaurant.managerName} (ID: {restaurant.managerId})</div> : <div>{restaurant.managerName} </div>}</p> */}
//             <p><strong>Manager :</strong> {restaurant.managerName} (ID: {restaurant.managerId})</p>
//             <p><strong>Email :</strong> {restaurant.email}</p>
//             <p><strong>Nom du restaurant :</strong> {restaurant.restaurantName}</p>
//             <p><strong>Adresse :</strong> {restaurant.address}</p>
//             <p><strong>Position :</strong> {restaurant.position.join(", ")}</p>
//             <p><strong>Téléphone :</strong> {restaurant.phone}</p>
//             <div className="mt-4">
//               <img src={restaurant.url} alt="Restaurant" className="w-full h-64 object-cover rounded-lg shadow-md" />
//             </div>
//           </div>
//         ) : (
//           <div className="text-center">
//             <p>Aucun restaurant associé.</p>
//             <Link to='/restaurateur/create-restaurant' className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">
//               Créer un restaurant
//             </Link>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Account;


import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router-dom";

interface IRestaurateur {
  _id : string;
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
      const response = await axios.get(`http://localhost:3001/api/restaurateurs/manager/${auth.user?.profile.sub}`);
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
        await axios.put(`http://localhost:3001/api/restaurateurs/${restaurant._id}`, restaurant);
        setIsEditing(false);
      } catch (error) {
        console.log(error);
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
        <p><strong>Email :</strong> {auth.user?.profile.email}</p>
        <p><strong>ID utilisateur :</strong> {auth.user?.profile.sub}</p>
        <p><strong>Nom :</strong> {auth.user?.profile.family_name}</p>
        <p><strong>Prénom :</strong> {auth.user?.profile.given_name}</p>
        <p className="mt-4 font-semibold">Rôles :</p>
        {roleEntries.length > 0 ? (
          <ul className="list-disc list-inside">
            {roleEntries.map(([role, value]) => (
              <li key={value} className="text-gray-600">{role}</li>
            ))}
          </ul>
        ) : (
          <p>Aucun rôle trouvé</p>
        )}
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold">Votre restaurant</h1>
        {isLoading ? (
          <p className="text-gray-500">Chargement...</p>
        ) : restaurant ? (
          <div className="space-y-4">
            <div>
              <strong>id restaurant :</strong> 
              <input
                type="text"
                value={restaurant._id}
                readOnly={true}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <strong>Manager :</strong> 
              <input
                type="text"
                value={restaurant.managerName}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, managerName: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <strong>Email :</strong> 
              <input
                type="text"
                value={restaurant.email}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, email: e.target.value })}
                className="border p-2 rounded"
              />
              
            </div>
            <div>
              <strong>Nom du restaurant :</strong>
              <input
                type="text"
                value={restaurant.restaurantName}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, restaurantName: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <strong>Adresse :</strong>
              <input
                type="text"
                value={restaurant.address}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, address: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <strong>Téléphone :</strong>
              <input
                type="text"
                value={restaurant.phone}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, phone: e.target.value })}
                className="border p-2 rounded"
              />
            </div>
            <div>
              <strong>Position :</strong>
              <input
              type="text"
              value={restaurant.position.join(", ")}
              readOnly={!isEditing}
              onChange={(e) => {
                const newPosition = e.target.value.split(", ").map((item) => parseFloat(item));
                
                // Assurer que newPosition contient bien deux éléments
                if (newPosition.length === 2) {
                  setRestaurant({
                    ...restaurant,
                    position: newPosition as [number, number],
                  });
                }
              }}
              className="border p-2 rounded w-auto"
            />

            </div>
            <div className="mt-4">
              <img src={restaurant.url} alt="Restaurant" className="w-full h-64 object-cover rounded-lg shadow-md" />
              <input
                type="text"
                value={restaurant.url}
                readOnly={!isEditing}
                onChange={(e) => setRestaurant({ ...restaurant, url: e.target.value })}
                className="border p-2 rounded w-200"
              />
            </div>
            <div className="mt-4">
              {isEditing ? (
                <button
                  onClick={handleSave}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={handleEdit}
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p>Aucun restaurant associé.</p>
            <Link to='/restaurateur/create-restaurant' className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition">
              Créer un restaurant
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
