import dotenv from 'dotenv'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import mongoose from 'mongoose'

const app = new Hono({ strict: false })
// app.use(logger())

dotenv.config()


const PORT = Number(process.env.PORT) || 3003

import commandeRoute from './routes/commandeRoute.js'
import { Commande } from './models/commandeModel.js'
import { logger } from 'hono/logger'

app.use('*', cors({
  origin: '*', // Autoriser toutes les origines
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}))

app.route('/api/commandes', commandeRoute)

app.get('/', (c) => {
  return c.text('GET / commande service')
})

app.get('/api/commandes-details', async (c) => {
  try {
    const orders = await Commande.find().limit(100)

    const enrichedOrders = await Promise.all(orders.map(async (order) => {
      // Appel à ZITADEL pour récupérer le displayName du client
      const zitadelRes = await fetch(`https://instance1-el5q1i.zitadel.cloud/v2/users/${order.clientId_Zitadel}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer srmrmkTWf1Yj_hH4Q3qS2ZnoCBbBC68UDWyl9gxqpvCcrT_5dBpE1dBcFTftbrZYGJbO4v6u4sBYH8VIrMtTABey3vEqj16GazZNZg2C',
        },
      })

      const zitadelData = await zitadelRes.json()
      const clientDisplayName = zitadelData?.user?.human?.profile?.displayName || 'Nom inconnu'

      const livreurInfos = await fetch(`https://instance1-el5q1i.zitadel.cloud/v2/users/${order.livreurId_Zitadel	}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer srmrmkTWf1Yj_hH4Q3qS2ZnoCBbBC68UDWyl9gxqpvCcrT_5dBpE1dBcFTftbrZYGJbO4v6u4sBYH8VIrMtTABey3vEqj16GazZNZg2C',
        },
      })

      const livreurData = await livreurInfos.json()
      const livreurDisplayName = livreurData?.user?.human?.profile?.displayName || 'Nom inconnu'

      // Appels aux autres microservices
      const [restaurantRes, menuRes] = await Promise.all([
        fetch(`http://localhost:3001/api/restaurateurs/${order.restaurantId}`),
        fetch(`http://localhost:3006/api/menus/${order.menuId}`)
      ])

      const restaurant = await restaurantRes.json()
      const menu = await menuRes.json()

      return {
        ...order.toObject(),
        clientName: clientDisplayName, // ici le nom du client issu de ZITADEL
        livreurName: livreurDisplayName,
        restaurantName: restaurant.restaurantName,
        menu: menu,
      }
    }))

    return c.json(enrichedOrders)
  } catch (error) {
    console.error('Error fetching enriched orders:', error)
    return c.json({ error: 'Internal Server Error' }, 500)
  }
})


const CommandeDbConnection = mongoose.connect('mongodb+srv://root:root@cluster0.zdnx3.mongodb.net/CesiEat_Commande?retryWrites=true&w=majority', {
})

CommandeDbConnection.then(() => {
  console.log('Connected to mongodb : CesiEat_Commande database')

  serve({
    fetch: app.fetch,
    port: PORT
  }, (info) => {
    console.log(`Server Commande is running on http://localhost:${info.port}`)
  })
})
