# System Architecture Diagrams

## High-Level System Architecture

```mermaid
graph TB
    subgraph "Frontend (Vue 3 + Quasar)"
        UI[User Interface]
        Store[Pinia Store]
        Socket[Socket.io Client]
    end
    
    subgraph "Backend (Node.js + Express)"
        API[REST API]
        SocketServer[Socket.io Server]
        Auth[Session Management]
    end
    
    subgraph "Database"
        PG[(PostgreSQL)]
    end
    
    subgraph "External Services"
        Confluence[Atlassian Confluence API]
        Export[Export Services]
    end
    
    UI --> Store
    Store --> API
    UI --> Socket
    Socket --> SocketServer
    API --> Auth
    API --> PG
    SocketServer --> PG
    Export --> Confluence
    API --> Export
```

## User Flow Diagram

```mermaid
flowchart TD
    Start([User Opens App]) --> Identify[User Identification View]
    Identify --> TeamChoice{Team Exists?}
    TeamChoice -->|No| CreateTeam[Create New Team]
    TeamChoice -->|Yes| JoinTeam[Join Existing Team]
    CreateTeam --> TeamDash[Team Dashboard]
    JoinTeam --> TeamDash
    
    TeamDash --> RetroChoice{Retro Session?}
    RetroChoice -->|New| CreateRetro[Create New Retro]
    RetroChoice -->|Existing| JoinRetro[Join Existing Retro]
    
    CreateRetro --> RetroBoard[Retro Board - Collection Phase]
    JoinRetro --> RetroBoard
    
    RetroBoard --> AddItems[Add Retro Items Async]
    AddItems --> Vote[Vote on Items]
    Vote --> FacilitatorControl{Is Facilitator?}
    
    FacilitatorControl -->|Yes| StartDiscussion[Start Discussion Phase]
    FacilitatorControl -->|No| WaitPhase[Wait for Phase Change]
    
    StartDiscussion --> RealTimeCollab[Real-time Collaboration]
    WaitPhase --> RealTimeCollab
    
    RealTimeCollab --> CreateActions[Create Action Items]
    CreateActions --> CompleteRetro[Complete Retro]
    CompleteRetro --> Export[Export Results]
    Export --> TeamDash
```

## Database Entity Relationship Diagram

```mermaid
erDiagram
    TEAMS ||--o{ USERS : "belongs to"
    TEAMS ||--o{ RETRO_SESSIONS : "has"
    USERS ||--o{ RETRO_SESSIONS : "facilitates"
    USERS ||--o{ RETRO_ITEMS : "authors"
    USERS ||--o{ VOTES : "casts"
    USERS ||--o{ ACTION_ITEMS : "assigned to"
    RETRO_SESSIONS ||--o{ RETRO_ITEMS : "contains"
    RETRO_SESSIONS ||--o{ ACTION_ITEMS : "generates"
    RETRO_ITEMS ||--o{ VOTES : "receives"
    
    TEAMS {
        uuid id PK
        string name
        text description
        timestamp created_at
        timestamp updated_at
    }
    
    USERS {
        uuid id PK
        string name
        string session_id UK
        uuid team_id FK
        boolean is_facilitator
        timestamp created_at
    }
    
    RETRO_SESSIONS {
        uuid id PK
        uuid team_id FK
        string title
        text description
        uuid facilitator_id FK
        enum phase
        timestamp scheduled_date
        timestamp created_at
        timestamp completed_at
    }
    
    RETRO_ITEMS {
        uuid id PK
        uuid session_id FK
        uuid author_id FK
        text content
        enum column_type
        integer position
        timestamp created_at
        timestamp updated_at
    }
    
    VOTES {
        uuid id PK
        uuid item_id FK
        uuid user_id FK
        timestamp created_at
    }
    
    ACTION_ITEMS {
        uuid id PK
        uuid session_id FK
        string title
        text description
        uuid assignee_id FK
        enum status
        date due_date
        timestamp created_at
        timestamp updated_at
    }
```

## Component Hierarchy

```mermaid
graph TD
    App[App.vue] --> Router[Vue Router]
    Router --> IdentifyView[IdentifyView.vue]
    Router --> TeamView[TeamView.vue]
    Router --> RetroView[RetroView.vue]
    
    IdentifyView --> UserForm[UserIdentificationForm.vue]
    IdentifyView --> TeamSelector[TeamSelector.vue]
    
    TeamView --> TeamDashboard[TeamDashboard.vue]
    TeamDashboard --> TeamMemberList[TeamMemberList.vue]
    TeamDashboard --> RetroHistory[RetroHistory.vue]
    TeamDashboard --> CreateRetroModal[CreateRetroModal.vue]
    
    RetroView --> RetroBoard[RetroBoard.vue]
    RetroBoard --> AppHeader[AppHeader.vue]
    RetroBoard --> PhaseIndicator[PhaseIndicator.vue]
    RetroBoard --> RetroColumn[RetroColumn.vue × 4]
    RetroBoard --> ActionItemsPanel[ActionItemsPanel.vue]
    
    RetroColumn --> RetroCard[RetroCard.vue × N]
    RetroColumn --> AddItemButton[AddItemButton.vue]
    
    RetroCard --> VoteButton[VoteButton.vue]
    RetroCard --> AuthorInfo[AuthorInfo.vue]
    
    ActionItemsPanel --> ActionItemCard[ActionItemCard.vue × N]
    ActionItemsPanel --> CreateActionItemModal[CreateActionItemModal.vue]
```

## Real-time Communication Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant F as Facilitator
    participant S as Socket.io Server
    participant DB as Database
    
    Note over U1,DB: Collection Phase (Async)
    U1->>S: join-session
    S->>DB: Update user session
    U1->>S: add-item
    S->>DB: Save item
    S->>U2: item-added (if online)
    
    Note over U1,DB: Discussion Phase (Real-time)
    F->>S: change-phase (discussion)
    S->>DB: Update session phase
    S->>U1: phase-changed
    S->>U2: phase-changed
    
    U1->>S: vote-item
    S->>DB: Save vote
    S->>U2: item-voted
    S->>F: item-voted
    
    U2->>S: move-item
    S->>DB: Update item position
    S->>U1: item-moved
    S->>F: item-moved
    
    F->>S: create-action-item
    S->>DB: Save action item
    S->>U1: action-item-created
    S->>U2: action-item-created
```

## API Endpoints Structure

### REST API Endpoints

```
Authentication & Session Management:
POST   /api/auth/identify          - Create user session
GET    /api/auth/session           - Get current session
DELETE /api/auth/session           - End session

Teams:
GET    /api/teams                  - List user's teams
POST   /api/teams                  - Create new team
GET    /api/teams/:id              - Get team details
PUT    /api/teams/:id              - Update team
DELETE /api/teams/:id              - Delete team
POST   /api/teams/:id/join         - Join existing team

Retro Sessions:
GET    /api/teams/:teamId/retros   - List team's retros
POST   /api/teams/:teamId/retros   - Create new retro
GET    /api/retros/:id             - Get retro details
PUT    /api/retros/:id             - Update retro
DELETE /api/retros/:id             - Delete retro
POST   /api/retros/:id/join        - Join retro session

Retro Items:
GET    /api/retros/:id/items       - Get retro items
POST   /api/retros/:id/items       - Create retro item
PUT    /api/items/:id              - Update retro item
DELETE /api/items/:id              - Delete retro item
POST   /api/items/:id/move         - Move item between columns

Voting:
POST   /api/items/:id/vote         - Toggle vote on item
GET    /api/items/:id/votes        - Get item votes

Action Items:
GET    /api/retros/:id/actions     - Get action items
POST   /api/retros/:id/actions     - Create action item
PUT    /api/actions/:id            - Update action item
DELETE /api/actions/:id            - Delete action item

Export:
GET    /api/retros/:id/export      - Export retro (markdown/json/csv)
POST   /api/retros/:id/confluence  - Export to Confluence
```

### Socket.io Events

```
Connection Events:
- connect
- disconnect
- join-session
- leave-session

Retro Item Events:
- item-added
- item-updated
- item-deleted
- item-moved
- item-voted

Session Management Events:
- phase-changed
- user-joined
- user-left
- facilitator-changed

Action Item Events:
- action-item-created
- action-item-updated
- action-item-deleted

Error Events:
- error
- validation-error
- permission-error
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        LB[Load Balancer]
        
        subgraph "Frontend"
            FE1[Vue App Instance 1]
            FE2[Vue App Instance 2]
        end
        
        subgraph "Backend"
            BE1[Node.js Instance 1]
            BE2[Node.js Instance 2]
            Redis[(Redis - Session Store)]
        end
        
        subgraph "Database"
            PG_Primary[(PostgreSQL Primary)]
            PG_Replica[(PostgreSQL Replica)]
        end
        
        subgraph "External"
            CDN[CDN for Static Assets]
            Confluence[Atlassian Confluence]
        end
    end
    
    LB --> FE1
    LB --> FE2
    FE1 --> CDN
    FE2 --> CDN
    
    FE1 --> BE1
    FE2 --> BE2
    BE1 --> Redis
    BE2 --> Redis
    
    BE1 --> PG_Primary
    BE2 --> PG_Primary
    PG_Primary --> PG_Replica
    
    BE1 --> Confluence
    BE2 --> Confluence
```

## Security Considerations

### Frontend Security:
- Input sanitization for all user inputs
- XSS prevention with Vue's built-in protections
- CSRF protection for API calls
- Content Security Policy (CSP) headers

### Backend Security:
- Rate limiting on all endpoints
- Input validation and sanitization
- SQL injection prevention with parameterized queries
- Session security with secure cookies
- CORS configuration for frontend domains

### Database Security:
- Connection encryption (SSL/TLS)
- Regular backups with encryption
- Access control with least privilege principle
- Database connection pooling with limits

### Socket.io Security:
- Room-based access control
- Event validation and sanitization
- Connection rate limiting
- Authentication verification for all events

---

*This comprehensive architecture provides a solid foundation for building a scalable, secure, and maintainable retrospective tool that meets all the specified requirements.*