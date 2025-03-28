// import axios from "axios";
// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";

// interface ICommande extends Document {
//   client: string;
//   restaurant: string;
//   livreur?: string;
//   items: { menuItem: []; name: string; price: number; }[];
//   totalAmount: number;
//   status: string;
// }


// const CommandesPage = () => {
//   const [commandes, setCommandes] = useState<ICommande[]>([]);

//   const [isLoading, setIsLoading] = useState(false);


//   const getCommandes = async () => {
//     try { 
//       // console.log(VITE_BACKEND_URL);
//       setIsLoading(true);
//       const response = await axios.get("http://localhost:3003/api/commandes");
//       // console.log(response.data);
//       setCommandes(response.data);
//       setIsLoading(false);
//     } catch (error) {
//       console.log(error);
//     }
//   }

//   useEffect(()=> {
//     getCommandes();
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
//         <Link to='/historique' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
//           Historique des commandes
//         </Link>
//       </div>

//       <div className="grid grid-cols-3 gap-6">
//         {/* Nouvelle Commande */}
//         <div className="bg-white p-4 rounded shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouvelles Commandes</h2>
//           <div className="bg-gray-200 p-4 rounded mb-4">
//             <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
//           </div>
//         </div>

//         {/* Commande en préparation */}
//         <div className="bg-white p-4 rounded shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Préparation</h2>
//           <div className="bg-gray-200 p-4 rounded mb-4">
//             <p className="text-gray-600">Aucune commande en préparation pour l'instant.</p>
//           </div>
//         </div>

//         {/* Commande en attente de récupération */}
//         <div className="bg-white p-4 rounded shadow-lg">
//           <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Attente de Récupération</h2>
//           <div className="bg-gray-200 p-4 rounded mb-4">
//             <p className="text-gray-600">Aucune commande en attente pour le moment.</p>
//           </div>
//         </div>
//       </div>

      
//       <div> test</div>
//       <div> 
//       <div className='grid grid-cols-2 lg:grid-cols-4 mt-5'>
//         {isLoading ? ("Loading") : (
//           <>
//           {commandes.length > 0 ? (
//              <>
//                 {
//                   commandes.map((commande,index) => {
//                     return (
//                       // <Product key={index} commande={commande} getCommandes={getCommandes}/>
//                       <div key={index}>
//                        {commande.status}
//                       </div>
//                     )
//                   })
//                 }
//              </>
//           ) : (

//             <div>
//               There is no products
//             </div>
//           )}
          
//           </>
//         )}
//       </div>
//       </div>
      



//     </div>



//   );
// };

// export default CommandesPage;


import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ICommande {
  client: string;
  restaurant: string;
  livreur?: string;
  items: { menuItem: []; name: string; price: number; }[];
  totalAmount: number;
  status: string;
}

const CommandesPage = () => {
  const [commandes, setCommandes] = useState<ICommande[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getCommandes = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:3003/api/commandes");
      setCommandes(response.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCommandes();
  }, []);

  // Filtrer les commandes par statut
  const nouvellesCommandes = commandes.filter((commande) => commande.status === "En attente");
  const enPreparationCommandes = commandes.filter((commande) => commande.status === "Préparation");
  const enAttenteDeRecupCommandes = commandes.filter((commande) => commande.status === "Prêt");
  const enLivraisonCommandes = commandes.filter((commande) => commande.status === "En livraison");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des Commandes</h1>
        <Link to='/historique' className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Historique des commandes
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 sm:grid-cols-1 gap-6">
        {/* Nouvelle Commande */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Nouvelles Commandes ({nouvellesCommandes.length})</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            {isLoading ? ('Loading') : (<>
            
            {nouvellesCommandes.length === 0 ? (
              <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
            ) : (
              nouvellesCommandes.map((commande, index) => (
                <div key={index} className="p-2 mb-2 border-b">
                  <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                  <p>Status: {commande.status}</p>
                </div>
              ))
            )}
            </>
            )}
            
          </div>
        </div>

        {/* Commande en préparation */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Préparation ({enPreparationCommandes.length})</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">

            {isLoading ? ('Loading') : ( 
              <>
              {enPreparationCommandes.length === 0 ? (
              <p className="text-gray-600">Aucune commande en préparation pour l'instant.</p>
              ) : (
              enPreparationCommandes.map((commande, index) => (
                <div key={index} className="p-2 mb-2 border-b">
                  <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                  <p>Status: {commande.status}</p>
                </div>
              ))
              )}
              </>)}
            
          </div>
        </div>

        {/* Commande en attente de récupération */}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Commandes en Attente de Récupération ({enAttenteDeRecupCommandes.length})</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            {isLoading ? ('Loading') : (
              <>
               {enAttenteDeRecupCommandes.length === 0 ? (
               <p className="text-gray-600">Aucune commande en attente pour le moment.</p>
               ) : (
               enAttenteDeRecupCommandes.map((commande, index) => (
                 <div key={index} className="p-2 mb-2 border-b">
                   <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                   <p>Status: {commande.status}</p>
                 </div>
               ))
               )}
              </>)}
            
          </div>
        </div>

        {/* Commande en Livraison*/}
        <div className="bg-white p-4 rounded shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">En livraison ({enLivraisonCommandes.length})</h2>
          <div className="bg-gray-200 p-4 rounded mb-4">
            {isLoading ? ('Loading') : (<>
            
            {enLivraisonCommandes.length === 0 ? (
              <p className="text-gray-600">Pas de nouvelles commandes pour le moment.</p>
            ) : (
              enLivraisonCommandes.map((commande, index) => (
                <div key={index} className="p-2 mb-2 border-b">
                  <p className="text-gray-800">Commande {index + 1}: {commande.client} - {commande.totalAmount}€</p>
                  <p>Status: {commande.status}</p>
                </div>
              ))
            )}
            </>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandesPage;


// // question : faire 3 appel dans commande en fonction du status des commandes ??
// // sinon revoir npm i @asseinfo/react-kanban \\ @asseinfo/react-kanban


// faire des cartes commandes pour mieux gerer les boutons, les appels et autres. 

// faire  des boutons qui apparaisse ou disparaisse dynamiquement en fonction du status de la commande. 