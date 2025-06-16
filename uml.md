# Diagramme :

## Diagramme de classes

```mermaid

classDiagram
    class User {
        +id: UUID
        +username: string
        +email: string
        +passwordHash: string
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
        +createdAt: Date
    }

    User --> Comment : "1 writes *"
    Article --> Comment : "1 receives *"
    User --> Article : "1 writes *"
    School --> Article : "* may be featured in *"

```

## Diagramme de 

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
## Diagramme de déploiment 

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


## Matrice décisionnel
|                        | Points forts                                                                                                                                                            | Points faibles                                                                                      |
|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------|
| NextJs (PWA)       | - Facilement déployable  <br> - Développement fullstack  <br> - Développement composant  <br> - Routage intégré  <br> - Version web & mobile paramétrable                 | - Responsive au lieu d’optimisation mobile  <br> - (vide)                                              |
| React Native       | - Compatibilité sur iOS et Android  <br> - Scalable  <br> - Développement composant  <br> - Orienté mobile  <br> - map : react-native-maps  <br> - video player : react-native-video  <br> - Grosse communauté | - Composants spécifiques comparés à NextJs  <br> - Présence d’un back à côté                             |
| Flutter            | - Orienté mobile  <br> - Développement multiplateforme  <br> - Connexion/Authentification simple avec Supabase  <br> - Libraries connues pour la localisation              | - Compliqué avec le back  <br> - Design peu libre et primitif  <br> - Version web peu adaptée (affichage mobile) |