// ID Commande	Identifiant unique de la commande
// Client	Nom et prénom du client
// Restaurant	Nom du restaurant ayant reçu la commande
// Livreur	Nom du livreur ayant pris en charge la commande (si affecté)
// Montant (€)	Montant total de la commande
// Heure de passation	Horodatage de la création de la commande
// Heure acceptation resto	Horodatage de l’acceptation par le restaurant
// Heure acceptation livraison	Horodatage de l’acceptation par le livreur
// Heure de livraison	Horodatage de l’acquittement de la livraison (si livrée)
// Statut actuel	Statut en cours : Créée / Acceptée resto / En livraison / Livrée / Annulée
// Durée totale	Temps écoulé depuis passation (ou durée complète si livrée)
// Actions	Voir détails, notifier, suspendre, contacter client/resto/livreur

import React from 'react'

import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { OrdersTable } from './OrdersTable'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'



function Dashboard() {
  // const queryClient = useQueryClient()
  // const [intervalMs, setIntervalMs] = React.useState(5000)
  // const [value, setValue] = React.useState('')

  // const { status, data, error, isFetching } = useQuery({
  //   queryKey: ['commandes'],
  //   queryFn: async (): Promise<Array<string>> => {
  //     //   const response = await fetch('https://jsonplaceholder.typicode.com/todos/1')
  //     const response = await fetch('http://localhost:3003/api/commandes')
  //     return await response.json()
  //   },
  //   // Refetch the data every second
  //   refetchInterval: intervalMs,
  // })

  // console.log(status)

  // if (status === 'pending') return <h1>Loading...</h1>

  // if (status === 'error') return <span>Error: {error.message}</span>

  // if (isFetching) return <div>Fetching ...</div>

  // console.log(data)


  return (
    <div>
      <div>
        Dashboard
      </div>
      <OrdersTable/>
    </div>
  )
}

export default Dashboard