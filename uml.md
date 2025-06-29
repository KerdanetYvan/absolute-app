# ANOMI
Une application d'information et de promotion d'écoles d'animation.

## Introduction

### Contexte du projet

ANOMI est une application web progressive (PWA) conçue pour faciliter la découverte et la promotion des écoles d'animation. Dans un secteur en pleine expansion, où l'offre de formation en animation se diversifie rapidement, il devient crucial de disposer d'un outil centralisé permettant aux étudiants potentiels de découvrir et comparer les différentes écoles disponibles.

### Objectifs

L'application ANOMI répond à plusieurs besoins identifiés :

- **Centralisation de l'information** : Regrouper les informations sur les écoles d'animation en un seul endroit accessible
- **Géolocalisation** : Permettre aux utilisateurs de localiser facilement les écoles proches de leur position
- **Contenu éditorial** : Proposer des articles informatifs sur le secteur de l'animation et les formations
- **Interaction communautaire** : Faciliter les échanges entre futurs étudiants via un système de commentaires
- **Accessibilité multiplateforme** : Offrir une expérience utilisateur optimale sur web et mobile

### Périmètre fonctionnel

L'application s'articule autour de trois types d'utilisateurs :

1. **Visiteurs** : Consultation libre des articles et informations sur les écoles
2. **Utilisateurs inscrits** : Fonctionnalités interactives (commentaires, favoris)
3. **Administrateurs** : Gestion du contenu éditorial et modération

### Architecture technique

Le projet adopte une approche fullstack avec Next.js, permettant de gérer frontend et backend dans un environnement unifié. Cette architecture garantit :

- Une maintenance simplifiée
- Des performances optimisées
- Un déploiement facilité
- Une évolutivité maîtrisée

### Méthodologie

Ce dossier technique présente l'analyse comparative des solutions techniques, la modélisation des données, et l'architecture système retenue. Il constitue le référentiel technique pour le développement et la maintenance de l'application ANOMI.

## Choix techniques
### Matrice décisionnelle

| Critères                      | Coefficient | NextJS (PWA)  | React Native  | Flutter |
|-------------------------------|-------------|---------------|---------------|---------|
| Déploiement                   | 5           | 5             | 3             | 3       |
| Système d'authentification    | 3           | 4             | 4             | 5       |
| Performance mobile            | 4           | 2             | 4             | 5       |
| Performance web               | 3           | 5             | 2             | 2       |
| Développement multiplateforme | 4           | 3             | 5             | 5       |
| Communauté                    | 4           | 5             | 5             | 3       |
| Total                         |             | 92            | 89            | 88      |

#### Avantages déterminants :
##### Développement fullstack : 
- Next.js permet de gérer le front-end et le back-end dans un même projet
##### Facilité de déploiement : 
- Intégration native avec Vercel pour un déploiement simplifié
##### PWA (Progressive Web App) :
- Permet de créer une application accessible sur web et mobile
##### Routage intégré : 
- Système de routage puissant et intuitif
##### Compromis acceptables :
- Le seul point faible notable est l'utilisation du responsive design au lieu d'une optimisation mobile native. Cependant, avec les frameworks CSS modernes comme Tailwind CSS, cela reste une solution viable.
##### Comparaison avec les alternatives :
- React Native aurait nécessité un backend séparé
- Flutter présente des limitations au niveau du design et de l'intégration backend

Le choix de Next.js apparaît donc comme le meilleur compromis pour développer une application web responsive qui peut fonctionner sur tous les supports, tout en gardant une base de code unique et facilement maintenable.

## Diagrammes
### Diagramme de classes

Ce diagramme présente la structure objet de l'application en définissant les entités principales (User, School, Article, Comment) avec leurs attributs et les relations qui les lient, permettant de visualiser l'architecture logique des données et leurs interactions.

```mermaid

classDiagram
    class User {
        +id: UUID
        +username: string
        +email: string
        +passwordHash: string
        +latitude: float
        +longitude: float
        +isAdmin: bool
        +createdAt: Date
    }

    class School {
        +id: UUID
        +name: string
        +address: string
        +city: string
        +latitude: float
        +longitude: float
        +website: string
        +createdAt: Date
    }

    class Article {
        +id: UUID
        +title: string
        +content: string
        +coverImageUrl: string
        +slug: string
        +authorId: UUID
        +schoolId: UUID
        +isPublished: bool
        +publishedAt: Date
    }

    class Comment {
        +id: UUID
        +idUser: UUID
        +content: string
        +idArticle: UUID
        +isModerated: bool
        +createdAt: Date
    }

    class Favorite {
        +id: UUID
        +userId: UUID
        +schoolId: UUID
        +createdAt: Date
    }

    User --> Comment : "1 writes *"
    Article --> Comment : "1 receives *"
    User --> Article : "1 writes *"
    School --> Article : "1 may be featured in *"
    User --> Favorite : "1 creates *"
    School --> Favorite : "1 is favorited *"

```
### Modélisation de la base de données

Ce diagramme traduit le modèle objet en structure de base de données, spécifiant les types de données, les clés primaires et étrangères, ainsi que les cardinalités des relations pour l'implémentation MongoDB.

```mermaid
classDiagram
    class User {
        UUID id
        string username
        string email
        string passwordHash
        float latitude
        float longitude
        bool isAdmin
        Date createdAt
    }

    class School {
        UUID id
        string name
        string address
        string city
        float latitude
        float longitude
        string website
        Date createdAt
    }

    class Article {
        UUID id
        string title
        string content
        string coverImageUrl
        string slug
        UUID authorId
        UUID schoolId
        bool isPublished
        Date publishedAt
    }

    class Comment {
        UUID id
        UUID idUser
        UUID idArticle
        string content
        bool isModerated
        Date createdAt
    }

    class Favorite {
        UUID id
        UUID userId
        UUID schoolId
        Date createdAt
    }

    %% Relations
    User "1" --> "many" Article : writes
    Article "1" --> "many" Comment : receives
    User "1" --> "many" Comment : writes
    School "1" --> "many" Article : may be featured in
    User "1" --> "many" Favorite : creates
    School "1" --> "many" Favorite : is favorited

```

### Diagramme de Séquences

Ce diagramme illustre les interactions dynamiques entre l'utilisateur, l'application mobile, l'API et la base de données lors des principales fonctionnalités (consultation des écoles, lecture d'articles, ajout de commentaires), détaillant le flux temporel des messages échangés.

```mermaid
sequenceDiagram
    participant User
    participant AppMobile
    participant API
    participant DB

    User->>AppMobile: Open the app
    AppMobile->>API: GET /schools
    API->>DB: SELECT * FROM schools
    DB-->>API: Return school list
    API-->>AppMobile: Send school list
    AppMobile->>User: Display map

    User->>AppMobile: Click on a school
    AppMobile->>API: GET /schools/:id
    API->>DB: SELECT * FROM schools WHERE id = ?
    DB-->>API: Return school details
    API-->>AppMobile: Send school data
    AppMobile->>User: Display school info

    User->>AppMobile: Open an article
    AppMobile->>API: GET /articles/:id
    API->>DB: SELECT * FROM articles WHERE id = ?
    DB-->>API: Return article data
    API-->>AppMobile: Send article content
    AppMobile->>User: Display article

    User->>AppMobile: Submit a comment
    AppMobile->>API: POST /comments
    API->>DB: INSERT INTO comments (...)
    DB-->>API: Success
    API-->>AppMobile: Comment saved
    AppMobile->>User: Show confirmation
```


### Diagramme de cas d'utilisation

Ce diagramme identifie les différents acteurs du système (Visiteur, Utilisateur inscrit, Admin) et leurs cas d'utilisation respectifs, mettant en évidence les fonctionnalités accessibles selon le niveau d'autorisation et les dépendances entre les actions.

```mermaid
graph TD

  %% Actors
  Visitor[Visitor]
  RegisteredUser[Registered User]
  Admin[Admin]

  %% Public features
  ReadArticle[Read an article]
  ViewSchool[View associated school]

  %% User features
  SignUp[Sign up]
  Login[Log in]
  Comment[Comment on an article]
  Favorite[Add a school to favorites]

  %% Admin features
  WriteArticle[Write an article]
  ManageArticles[Manage articles]
  LinkSchool[Link a school to an article]
  DeleteComment[Delete a comment]

  %% Visitor links
  Visitor --> ReadArticle
  Visitor --> ViewSchool

  %% Registered user links
  RegisteredUser --> SignUp
  RegisteredUser --> Login
  RegisteredUser --> Comment
  RegisteredUser --> Favorite

  %% Logical dependencies (include)
  Comment --> Login
  Favorite --> Login

  %% Admin links
  Admin --> WriteArticle
  Admin --> ManageArticles
  Admin --> LinkSchool
  Admin --> DeleteComment

  %% Logical dependencies between admin use cases
  ManageArticles --> WriteArticle
  LinkSchool --> WriteArticle



```


### Diagramme de déploiement 

Ce diagramme représente l'architecture physique de déploiement de l'application, montrant la répartition des composants entre le client (PWA), le serveur Vercel (Next.js) et la base de données MongoDB Atlas, avec les protocoles de communication utilisés.

```mermaid
graph TD
    subgraph Client
        A[Web Navigator - PWA]
    end

    subgraph "Vercel"
        B[Next.js App<br/>Fullstack + API Routes]
    end

    subgraph "MongoDB Atlas"
        C[Database MongoDB]
    end

    A -->|HTTPS/TLS| B
    B -->|MongoDB Driver<br/>Connection String| C
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
```

## Annexes

### Dépôt GitHub
Voici le lien du dépôt GitHub : [Lien du dépôt](https://github.com/KerdanetYvan/absolute-app)

### Notion
Nous suivons l'avancement du projet grâce à Notion.
[Lien du Notion](https://clumsy-houseboat-021.notion.site/Suivi-projet-2154e227b44b802d9603f3979091adb9)