# Retrospective Tool - Architecture & Design Document

## Project Overview
An in-house retrospective tool for distributed teams with hybrid workflow support (async item collection + real-time discussion phases).

## Technology Stack

### Frontend
- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Library**: Quasar Framework
- **Language**: TypeScript
- **State Management**: Pinia (Vue 3 recommended)
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Real-time**: Socket.io
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Language**: TypeScript

## Database Schema Design

### Core Entities

```sql
-- Teams table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table (session-based, no auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    team_id UUID REFERENCES teams(id),
    is_facilitator BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Retro sessions table
CREATE TABLE retro_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID REFERENCES teams(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    facilitator_id UUID REFERENCES users(id),
    phase ENUM('collection', 'discussion', 'completed') DEFAULT 'collection',
    scheduled_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Retro items table
CREATE TABLE retro_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES retro_sessions(id) NOT NULL,
    author_id UUID REFERENCES users(id) NOT NULL,
    content TEXT NOT NULL,
    column_type ENUM('went_well', 'didnt_go_well', 'learned', 'puzzles') NOT NULL,
    position INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Votes table
CREATE TABLE votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID REFERENCES retro_items(id) NOT NULL,
    user_id UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(item_id, user_id)
);

-- Action items table
CREATE TABLE action_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES retro_sessions(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    assignee_id UUID REFERENCES users(id),
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    due_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## UI Layout & Components

### 1. User Identification View (`/identify`)
- Simple form with name input
- Team selection/creation
- Session persistence
- Clean, welcoming design

### 2. Team Dashboard (`/team/:teamId`)
- List of past retros
- Create new retro button
- Team member list
- Action items overview

### 3. Main Retro Dashboard (`/retro/:sessionId`)

#### Layout Structure:
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Session Title | Phase Indicator | Facilitator Controls │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │What went    │ │What didn't  │ │What have I  │ │What still   │ │
│ │well?        │ │go well?     │ │learned?     │ │puzzles me?  │ │
│ │             │ │             │ │             │ │             │ │
│ │ [+ Add]     │ │ [+ Add]     │ │ [+ Add]     │ │ [+ Add]     │ │
│ │             │ │             │ │             │ │             │ │
│ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │ ┌─────────┐ │ │
│ │ │ Card 1  │ │ │ │ Card A  │ │ │ │ Card X  │ │ │ │ Card I  │ │ │
│ │ │ Author  │ │ │ │ Author  │ │ │ │ Author  │ │ │ │ Author  │ │ │
│ │ │ 👍 3    │ │ │ │ 👍 1    │ │ │ │ 👍 5    │ │ │ │ 👍 2    │ │ │
│ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │ └─────────┘ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Action Items Panel (Collapsible)                           │
└─────────────────────────────────────────────────────────────┘
```

#### Card Component Features:
- Drag and drop between columns
- Upvote button with count
- Author name display
- Edit/delete for own items
- Real-time updates

### 4. Add Item Modal
- Column selection (pre-selected based on clicked column)
- Rich text input
- Character limit indicator
- Preview functionality

### 5. Action Items Panel
- Create action items from retro discussions
- Assign to team members
- Set due dates
- Track status

## Real-time Features with Socket.io

### Events:
- `join-session`: User joins retro session
- `leave-session`: User leaves retro session
- `item-added`: New retro item created
- `item-moved`: Item dragged to different column
- `item-voted`: Vote added/removed
- `phase-changed`: Facilitator changes session phase
- `action-item-created`: New action item added

### Phase Management:
1. **Collection Phase**: Async item addition, no real-time updates needed
2. **Discussion Phase**: Real-time collaboration, live updates, facilitator controls
3. **Completed Phase**: Read-only, export available

## Export Functionality

### Markdown Export Format:
```markdown
# Retrospective - [Session Title]
**Date**: [Date]
**Team**: [Team Name]
**Facilitator**: [Facilitator Name]

## What Went Well? 👍
- [Item content] (👍 [vote count]) - *[Author]*
- [Item content] (👍 [vote count]) - *[Author]*

## What Didn't Go Well? 👎
- [Item content] (👍 [vote count]) - *[Author]*

## What Have I Learned? 🧠
- [Item content] (👍 [vote count]) - *[Author]*

## What Still Puzzles Me? 🤔
- [Item content] (👍 [vote count]) - *[Author]*

## Action Items 📋
- [ ] [Action item] - Assigned to: [Assignee] - Due: [Date]
- [x] [Completed action item] - Assigned to: [Assignee]

---
*Generated by Retro Tool on [timestamp]*
```

### Future Atlassian Integration:
- Confluence API integration
- Auto-create pages in designated space
- Template-based page creation
- Link to previous retros

## Component Architecture

### Vue Components Structure:
```
src/
├── components/
│   ├── common/
│   │   ├── AppHeader.vue
│   │   ├── LoadingSpinner.vue
│   │   └── ErrorBoundary.vue
│   ├── retro/
│   │   ├── RetroBoard.vue
│   │   ├── RetroColumn.vue
│   │   ├── RetroCard.vue
│   │   ├── AddItemModal.vue
│   │   └── PhaseIndicator.vue
│   ├── team/
│   │   ├── TeamDashboard.vue
│   │   ├── TeamMemberList.vue
│   │   └── CreateTeamModal.vue
│   └── actionItems/
│       ├── ActionItemsPanel.vue
│       ├── ActionItemCard.vue
│       └── CreateActionItemModal.vue
├── views/
│   ├── IdentifyView.vue
│   ├── TeamView.vue
│   └── RetroView.vue
├── stores/
│   ├── auth.ts (session management)
│   ├── retro.ts
│   ├── team.ts
│   └── socket.ts
└── composables/
    ├── useSocket.ts
    ├── useDragDrop.ts
    └── useExport.ts
```

## Development Phases

### Phase 1: Core Foundation
- Project setup
- Basic UI layout
- Database schema
- User identification

### Phase 2: Basic Retro Functionality
- Retro board with 4 columns
- Add/edit/delete items
- Basic voting system

### Phase 3: Real-time Features
- Socket.io integration
- Live collaboration
- Phase management

### Phase 4: Advanced Features
- Action items
- Export functionality
- Team management
- Session history

### Phase 5: Polish & Enhancements
- Mobile responsiveness
- Analytics
- Atlassian integration
- Performance optimization

## Technical Considerations

### Performance:
- Virtual scrolling for large item lists
- Debounced real-time updates
- Optimistic UI updates

### Security:
- Input sanitization
- Rate limiting on API endpoints
- Session validation

### Scalability:
- Database indexing strategy
- Socket.io room management
- Horizontal scaling considerations

---

*This document will be updated as we refine the requirements and implementation details.*