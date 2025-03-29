CESIEAT
Projet CESI : Création d'un site web de commande et livraison de repas.


micro service : 
- commande 
- client 
- restaurateur
- livreur
- article 

// rajouter les ports de chacun 

frontend : 
- client 
- livreur
- Restaurateur

// rajouter les ports de chacun 



Pour lancer docker : docker-compose up -d --build

Listes des URL env docker (nginx):

FRONTEND
- http://localhost:8080/client/
- http://localhost:8080/restaurateur/
- http://localhost:8080/livreur/

BACKEND
- http://localhost:8080/api/menus
- http://localhost:8080/api/restaurateurs
- http://localhost:8080/api/articles
- http://localhost:8080/api/clients
- http://localhost:8080/api/commandes
- http://localhost:8080/api/livreurs

