# CESI Eat 🍔🚴‍♂️

Bienvenue dans **CESI Eat**, une version refaite du célèbre service de livraison de nourriture, Uber Eats, conçue dans le cadre d'un projet scolaire. Ce projet est une application web de commande et de livraison de repas avec une architecture **Microservices** et une pile technologique moderne.

## 🌐 Technologies utilisées

- **Frontend** : React.js, TailwindCSS
- **Backend** : Microservices avec **Hono** et **Zitadel** pour la gestion des utilisateurs
- **Base de données** : MongoDB
- **Containerisation** : Docker
- **Orchestration** : Kubernetes

## ⚙️ Architecture

Le projet est basé sur une architecture **microservices**, permettant à chaque fonctionnalité d'être indépendante et scalable. L'ensemble des microservices communique via des API REST. Nous avons choisi une approche décentralisée pour chaque partie de l'application afin d'assurer flexibilité et maintenabilité.

## 📖 Fonctionnalités
- Inscription & Connexion des utilisateurs : Les utilisateurs peuvent s'inscrire et se connecter via Zitadel, une plateforme d'authentification moderne.

- Menu interactif : Affichage des restaurants et des plats disponibles avec des options de filtrage et de recherche.

- Gestion des commandes : Les utilisateurs peuvent créer des commandes, suivre leur statut en temps réel et consulter l'historique des commandes passées.

- Suivi de livraison : Suivi des commandes en temps réel avec des notifications push pour les utilisateurs afin de les tenir informés.

- Interface responsive : L'application est optimisée pour une utilisation fluide sur mobile et desktop grâce à TailwindCSS.

- (Système de paiement intégré : Simulez un processus de paiement sécurisé (pour la démo, ce système peut être connecté à une API de paiement).)

- (Gestion des avis et évaluations : Les utilisateurs peuvent noter les restaurants et laisser des avis sur les plats qu'ils ont commandés.)


## 🛠️ Équipe
Nous sommes une équipe de 4 développeurs travaillant ensemble pour réaliser ce projet :

Développeur 1 : Frontend (React.js, TailwindCSS)

Conception et développement de l'interface utilisateur.

Mise en œuvre des composants interactifs et responsives.

Développeur 2 : Backend (Hono, MongoDB)

Création des microservices backend.

Gestion de la base de données MongoDB et des APIs.

Développeur 3 : Kubernetes, Docker

Mise en place de la containerisation avec Docker.

Déploiement des microservices sur Kubernetes pour une gestion optimale en production.

Développeur 4 : Authentification et gestion des utilisateurs (Zitadel)

Intégration du système d'authentification utilisateur avec Zitadel.

Sécurisation des accès et gestion des sessions utilisateur.

## 📅 Roadmap
Voici les étapes prévues pour le développement et l'amélioration de l'application :


Phase 1 : Setup initial (Frontend, Backend, Docker)
    Mise en place des environnements de développement et des services de base.

Phase 2 : Intégration de l'authentification avec Zitadel
    Mise en œuvre de l'authentification des utilisateurs via Zitadel.
    Test de la sécurité des processus de connexion et d'inscription.

Phase 3 : Déploiement sur Kubernetes
    Déploiement des services sur Kubernetes pour la gestion des microservices en production.

Phase 4 : Améliorations UI/UX et optimisations
    Amélioration de l'interface utilisateur pour une meilleure expérience.
    Optimisation des performances des microservices et du frontend.

Phase 5 : Tests & Validation
    Tests de charge et de sécurité pour garantir la robustesse de l'application.
    Validation de l'ensemble des fonctionnalités en conditions réelles.

Phase 6 : Lancement et maintenance
    Déploiement final de l'application et maintenance continue.


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


# Models backend Data

## Restaurateur
- id 
- position [lat,long]
- managerName String
- email String
- restaurantName String
- address String
- phone String
- url(image) String
- managerId(Zitadel) String

## Livreur
- id 
- name String
- email String
- phone String
- vehiculeType String
- codeLivreur String
- id(Zitadel)

## Client
- id 
- name String
- email String
- phone String
- address String
- isPaused boolean
  
## Menu
- id 
- name String
- price float
- articles Array[]
- restaurateurId id
- image String

## Commandes
- id 
- clientId
- restaurantId
- livreurId
- menuId
- totalAmount int
- status String

## articles
- id 
- name String
- price float
- reference String
- type String
- url(image) String
- restaurantId 
