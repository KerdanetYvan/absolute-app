# Diagramme :

## Diagramme de classes

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
        +publishedAt: Date
    }

    class Comment {
        +id: UUID
        +idUser: UUID
        +content: string
        +idArticle: UUID
        +createdAt: Date
    }

    User --> Comment : "1 writes *"
    Article --> Comment : "1 receives *"
    User --> Article : "1 writes *"
    School --> Article : "* may be featured in *"

```
## Modélisation de la base de données
```mermaid
classDiagram
    class User {
        UUID id
        string username
        string email
        string passwordHash
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
        Date publishedAt
    }

    class Comment {
        UUID id
        UUID idUser
        UUID idArticle
        string content
        Date createdAt
    }

    %% Relations
    User "1" --> "many" Article : writes
    Article "1" --> "many" Comment : receives
    User "1" --> "many" Comment : writes
    School "0..1" <-- "many" Article : may be featured in

```

## Diagramme de Séquences

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


## Diagramme de cas d'utilisation
```mermaid
graph TD

  %% Acteurs
  Visiteur[👤 Visiteur]
  Utilisateur[👤 Utilisateur inscrit]
  Admin[👤 Admin]

  %% Fonctionnalités publiques
  LireArticle[Lire un article]
  VoirEcole[Voir école associée]

  %% Fonctionnalités utilisateur
  Inscription[S'inscrire]
  Connexion[Se connecter]
  Commenter[Commenter un article]
  Favori[Mettre une école en favori]

  %% Fonctionnalités admin
  EcrireArticle[Écrire un article]
  GérerArticles[Gérer les articles]
  AssocierEcole[Associer une école à un article]
  SupprimerCommentaire[Supprimer un commentaire]

  %% Liens Visiteur
  Visiteur --> LireArticle
  Visiteur --> VoirEcole

  %% Liens Utilisateur
  Utilisateur --> Inscription
  Utilisateur --> Connexion
  Utilisateur --> Commenter
  Utilisateur --> Favori

  %% Dépendance logique (include)
  Commenter --> Connexion
  Favori --> Connexion

  %% Liens Admin
  Admin --> EcrireArticle
  Admin --> GérerArticles
  Admin --> AssocierEcole
  Admin --> SupprimerCommentaire

  %% Dépendance logique entre cas admin
  GérerArticles --> EcrireArticle
  AssocierEcole --> EcrireArticle


```


## Diagramme de déploiement 

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


## Matrice décisionnelle

| Critères                      | Coefficient | NextJS (PWA)  | React Native  | Flutter |
|-------------------------------|-------------|---------------|---------------|---------|
| Déploiement                   | 5           | 5             | 3             | 3       |
| Système d'authentification    | 3           | 4             | 4             | 5       |
| Performance mobile            | 4           | 2             | 4             | 5       |
| Performance web               | 3           | 5             | 2             | 2       |
| Développement multiplateforme | 4           | 3             | 5             | 5       |
| Communauté                    | 4           | 5             | 5             | 3       |
| Total                         |             | 92            | 89            | 88      |



### Avantages déterminants :
#### Développement fullstack : 
- Next.js permet de gérer le front-end et le back-end dans un même projet
#### Facilité de déploiement : 
- Intégration native avec Vercel pour un déploiement simplifié
#### PWA (Progressive Web App) :
- Permet de créer une application accessible sur web et mobile
#### Routage intégré : 
- Système de routage puissant et intuitif
#### Compromis acceptables :
- Le seul point faible notable est l'utilisation du responsive design au lieu d'une optimisation mobile native. Cependant, avec les frameworks CSS modernes comme Tailwind CSS (déjà configuré dans votre projet), cela reste une solution viable.
#### Comparaison avec les alternatives :
- React Native aurait nécessité un backend séparé
Flutter présente des limitations au niveau du design et de l'intégration backend
Le choix de Next.js apparaît donc comme le meilleur compromis pour développer une application web responsive qui peut fonctionner sur tous les supports, tout en gardant une base de code unique et facilement maintenable.