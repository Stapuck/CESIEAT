import axios from "axios";
import { useEffect, useState } from "react";
import { FaWalking, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

// const orders = [
//   { restaurant: "Etna", customer: "Terence", distance: "3.5 km", price: "12€" },
//   { restaurant: "KFC", customer: "Louis", distance: "5.5 km", price: "23€" },
//   { restaurant: "Sozen", customer: "Jo", distance: "1.2 km", price: "6.5€" },
//   { restaurant: "Sozen", customer: "Jo", distance: "1.2 km", price: "6.5€" },
//   { restaurant: "Sozen", customer: "Jo", distance: "1.2 km", price: "6.5€" },
// ];



interface ICommande {
  _id: string;
  client: number;
  restaurant: number;
  livreur?: number;
  menu: [];
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface IClient {
  _id: number;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  isPaused: boolean;
}


interface IRestaurateur {
  _id: number;
  managerName: string;
  email: string;
  password: string;
  restaurantName: string;
  address: string;
  phone: string;
}


  

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [clients, setClients] = useState<IClient[]>([]);
  const [restaurateurs, setRestaurateur] = useState<IRestaurateur[]>([]);


  const getCommandes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/commandes");
      setCommandes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getClients = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/clients");
      setClients(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getRestaurateurs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:8080/api/restaurateurs");
      setRestaurateur(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };


  useEffect(() => {
    getCommandes();
    getClients();
    getRestaurateurs();
  }, []);

  // const [restaurateursMap, setRestaurateursMap] = useState<Map<number, string>>(new Map());

  // useEffect(() => {
  //   setRestaurateursMap(new Map(restaurateurs.map(r => [r._id, r.restaurantName])));
  // }, [restaurateurs]);


 
  return (
    <div className="bg-gray-800 min-h-screen flex flex-col items-center p-4">
      <div className="bg-purple-300 w-full max-w-md p-4 flex justify-end items-center rounded-t-xl">
        <Link to={'/account'}>
          <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">👤</div>
        </Link> 
        {/* todo mettre l'account dans le header */}
      </div>
      <div className="bg-white w-full max-w-md p-4 rounded-b-xl">
        <h2 className="text-lg font-semibold mb-2">Commande à proximité</h2>
        <div className="flex border-2 w-full h-70 justify-center items-center mb-4">
          map
        </div>
        {/* <img src="/map-placeholder.png" alt="Carte" className="w-full rounded-lg mb-4" /> */}
        <div className="space-y-2">
          {isLoading ? ('Loading') : (
            <>
              {commandes.map((commande, index) => (
                // faire un composant pour une meilleur gestion. 
              <div key={index} className="bg-purple-200 flex justify-between items-center p-3 rounded-lg shadow">
                <div className="flex-1">
                <p className="font-semibold">
                  {restaurateurs.find(r => r._id === commande.restaurant)?.restaurantName || "Restaurant inconnu"} 
                  → {clients.find(c => c._id === commande.client)?.name || "Client inconnu"} 
                </p>

                {/* <p className="font-semibold">
                  {restaurateursMap.get(commande.restaurant) || "Restaurant inconnu"} → {commande.client}
                </p> */}

                <p className="font-semibold text-xs">
                  {restaurateurs.find(r => r._id === commande.restaurant)?.address || "Restaurant address inconnu"} 
                  → {clients.find(c => c._id === commande.client)?.address || "Client address inconnu"} 
                </p>
                  <p className="text-sm">distance (todo) - {commande.totalAmount}</p>
                  {/* comment calculer la distance ?  */}
                </div>
                <Link to={`/livraison/${commande._id}`}>
                  <FaWalking className="text-lg mr-2" />
                </Link>
                <FaTrash className="text-lg text-gray-600 cursor-pointer" /> 
                {/*
                  poubelle cacher à l'utilisateur la commande 
                  marche accepter la commande et donc mettre une map avec la position de la personne vers la destination
                  + changer le status de la commande à en attente de récupération. 
                */}
              </div>
            ))}
          </>)}
        </div>
      </div>
    </div>
  );
}


// test calcul de distance avec api google 

// import axios from "axios";
// import { useEffect, useState } from "react";
// import { FaWalking, FaTrash } from "react-icons/fa";
// import { Link } from "react-router-dom";

// const API_KEY = ""; // Mets ta clé Google Maps ici

// interface ICommande {
//   _id: string;
//   client: number;
//   restaurant: number;
//   livreur?: number;
//   menu: [];
//   totalAmount: number;
//   status: string;
//   createdAt: string;
//   updatedAt: string;
// }

// interface IClient {
//   _id: number;
//   name: string;
//   email: string;
//   password: string;
//   address: string;
//   phone: string;
//   isPaused: boolean;
// }

// interface IRestaurateur {
//   _id: number;
//   managerName: string;
//   email: string;
//   password: string;
//   restaurantName: string;
//   address: string;
//   phone: string;
// }

// export default function HomePage() {
//   const [isLoading, setIsLoading] = useState(false);
//   const [commandes, setCommandes] = useState<ICommande[]>([]);
//   const [clients, setClients] = useState<IClient[]>([]);
//   const [restaurateurs, setRestaurateurs] = useState<IRestaurateur[]>([]);
//   const [distances, setDistances] = useState<{ [key: string]: string }>({}); // Stocke les distances

//   const getCommandes = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("http://localhost:3003/api/commandes");
//       setCommandes(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getClients = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("http://localhost:3000/api/clients");
//       setClients(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const getRestaurateurs = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get("http://localhost:3001/api/restaurateurs");
//       setRestaurateurs(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   // 🔹 Fonction pour récupérer la distance entre 2 adresses avec Google Maps
//   const getDistance = async (restaurantAddress: string, clientAddress: string, orderId: string) => {
//     try {
//       const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(restaurantAddress)}&destinations=${encodeURIComponent(clientAddress)}&key=${API_KEY}`;
      
//       const response = await axios.get(url);
//       const distance = response.data.rows[0].elements[0].distance.text; // Distance en km/m

//       setDistances((prev) => ({ ...prev, [orderId]: distance })); // Stocker la distance
//     } catch (error) {
//       console.error("Erreur lors du calcul de la distance", error);
//       setDistances((prev) => ({ ...prev, [orderId]: "Distance inconnue" }));
//     }
//   };

//   // 🔹 UseEffect pour récupérer les commandes, clients, et restaurateurs
//   useEffect(() => {
//     getCommandes();
//     getClients();
//     getRestaurateurs();
//   }, []);

//   // 🔹 UseEffect pour calculer la distance une fois les commandes, clients et restaurateurs chargés
//   useEffect(() => {
//     if (commandes.length > 0 && clients.length > 0 && restaurateurs.length > 0) {
//       commandes.forEach((commande) => {
//         const restaurant = restaurateurs.find((r) => r._id === commande.restaurant);
//         const client = clients.find((c) => c._id === commande.client);

//         if (restaurant && client) {
//           getDistance(restaurant.address, client.address, commande._id);
          
//           console.log(getDistance(restaurant.address, client.address, commande._id));
//         }
//       });
//     }
//   }, [commandes, clients, restaurateurs]); // Dépendances corrigées

//   return (
//     <div className="bg-gray-800 min-h-screen flex flex-col items-center p-4">
//       <div className="bg-purple-300 w-full max-w-md p-4 flex justify-end items-center rounded-t-xl">
//         <Link to={'/account'}>
//           <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white">👤</div>
//         </Link> 
//       </div>
//       <div className="bg-white w-full max-w-md p-4 rounded-b-xl">
//         <h2 className="text-lg font-semibold mb-2">Commande à proximité</h2>
//         <div className="flex border-2 w-full h-70 justify-center items-center mb-4">
//           map
//         </div>
//         <div className="space-y-2">
//           {isLoading ? ('Loading') : (
//             <>
//               {commandes.map((commande) => (
//                 <div key={commande._id} className="bg-purple-200 flex justify-between items-center p-3 rounded-lg shadow">
//                   <div className="flex-1">
//                     <p className="font-semibold">
//                       {restaurateurs.find(r => r._id === commande.restaurant)?.restaurantName || "Restaurant inconnu"} 
//                       → {clients.find(c => c._id === commande.client)?.name || "Client inconnu"} 
//                     </p>

//                     <p className="font-semibold text-xs">
//                       {restaurateurs.find(r => r._id === commande.restaurant)?.address || "Restaurant address inconnu"} 
//                       → {clients.find(c => c._id === commande.client)?.address || "Client address inconnu"} 
//                     </p>

//                     <p className="text-sm">Distance : {distances[commande._id] || "Calcul en cours..."}</p>
//                     <p className="text-sm">Total : {commande.totalAmount}€</p>
//                   </div>
//                   <FaWalking className="text-lg mr-2" />
//                   <FaTrash className="text-lg text-gray-600 cursor-pointer" /> 
//                 </div>
//               ))}
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
