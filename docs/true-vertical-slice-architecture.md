# True Vertical Slice Architecture for Retrospective Tool

## What is True Vertical Slice Architecture?

A **true vertical slice** contains everything needed to deliver a complete user capability from UI to database. Each slice should be:

1. **Independently deployable** - Can work without other slices
2. **End-to-end complete** - Contains all layers (UI, business logic, data)
3. **User-centric** - Organized around user capabilities, not technical concerns
4. **Minimally coupled** - Shares as little as possible with other slices

## Current Architecture Analysis

Looking at my previous proposal, I realize it's **not truly vertical** - it's more of a "feature-based horizontal layering." Here's why:

❌ **Problems with Previous Structure:**
- Still organized by technical domains (`/teams`, `/collaboration`, `/exports`)
- Shared dependencies between slices
- Not independently deployable
- Missing the "user capability" focus

## Revised True Vertical Slice Architecture

### Core Insight: Retrospectives Beyond Columns

You're absolutely right - future retrospectives might not follow column patterns at all. Consider these formats:
- **Timeline retrospectives** (events on a timeline)
- **Mood board retrospectives** (visual/image-based)
- **Voting-only retrospectives** (just vote on pre-defined topics)
- **Free-form retrospectives** (canvas-style with sticky notes anywhere)
- **Structured questionnaires** (form-based with specific questions)

This requires a **completely flexible data model** and **format-agnostic architecture**.

## True Vertical Slices by User Capabilities

### Frontend Structure

```
frontend/src/
├── slices/
│   ├── user-onboarding/              # "I want to join a retrospective"
│   │   ├── ui/
│   │   │   ├── IdentifyView.vue
│   │   │   ├── JoinSessionView.vue
│   │   │   └── components/
│   │   ├── business/
│   │   │   ├── onboardingService.ts
│   │   │   └── sessionValidator.ts
│   │   ├── data/
│   │   │   ├── userRepository.ts
│   │   │   └── sessionRepository.ts
│   │   ├── types/
│   │   │   └── onboarding.types.ts
│   │   └── api/
│   │       └── onboardingApi.ts
│   │
│   ├── team-creation/                # "I want to create and manage a team"
│   │   ├── ui/
│   │   │   ├── CreateTeamView.vue
│   │   │   ├── ManageTeamView.vue
│   │   │   └── components/
│   │   ├── business/
│   │   │   ├── teamService.ts
│   │   │   └── membershipService.ts
│   │   ├── data/
│   │   │   └── teamRepository.ts
│   │   ├── types/
│   │   │   └── team.types.ts
│   │   └── api/
│   │       └── teamApi.ts
│   │
│   ├── retro-facilitation/           # "I want to facilitate a retrospective"
│   │   ├── ui/
│   │   │   ├── CreateRetroView.vue
│   │   │   ├── FacilitatorDashboard.vue
│   │   │   ├── FormatSelector.vue
│   │   │   └── components/
│   │   │       ├── PhaseControls.vue
│   │   │       └── SessionSettings.vue
│   │   ├── business/
│   │   │   ├── facilitationService.ts
│   │   │   ├── formatRegistry.ts
│   │   │   └── phaseManager.ts
│   │   ├── data/
│   │   │   ├── retroRepository.ts
│   │   │   └── formatRepository.ts
│   │   ├── types/
│   │   │   └── facilitation.types.ts
│   │   └── api/
│   │       └── facilitationApi.ts
│   │
│   ├── retro-participation/          # "I want to participate in a retrospective"
│   │   ├── ui/
│   │   │   ├── ParticipantView.vue
│   │   │   ├── RetroCanvas.vue       # Format-agnostic canvas
│   │   │   └── components/
│   │   │       ├── ItemCreator.vue
│   │   │       ├── VotingInterface.vue
│   │   │       └── format-renderers/
│   │   │           ├── ColumnRenderer.vue
│   │   │           ├── TimelineRenderer.vue
│   │   │           ├── CanvasRenderer.vue
│   │   │           └── FormRenderer.vue
│   │   ├── business/
│   │   │   ├── participationService.ts
│   │   │   ├── itemService.ts
│   │   │   ├── votingService.ts
│   │   │   └── formatRenderer.ts
│   │   ├── data/
│   │   │   ├── itemRepository.ts
│   │   │   └── voteRepository.ts
│   │   ├── types/
│   │   │   └── participation.types.ts
│   │   └── api/
│   │       └── participationApi.ts
│   │
│   ├── action-tracking/              # "I want to track action items"
│   │   ├── ui/
│   │   │   ├── ActionItemsView.vue
│   │   │   ├── CreateActionView.vue
│   │   │   └── components/
│   │   ├── business/
│   │   │   ├── actionService.ts
│   │   │   └── trackingService.ts
│   │   ├── data/
│   │   │   └── actionRepository.ts
│   │   ├── types/
│   │   │   └── action.types.ts
│   │   └── api/
│   │       └── actionApi.ts
│   │
│   ├── retro-export/                 # "I want to export retrospective results"
│   │   ├── ui/
│   │   │   ├── ExportView.vue
│   │   │   ├── PreviewModal.vue
│   │   │   └── components/
│   │   ├── business/
│   │   │   ├── exportService.ts
│   │   │   ├── formatters/
│   │   │   │   ├── markdownFormatter.ts
│   │   │   │   ├── pdfFormatter.ts
│   │   │   │   └── confluenceFormatter.ts
│   │   │   └── templateEngine.ts
│   │   ├── data/
│   │   │   └── exportRepository.ts
│   │   ├── types/
│   │   │   └── export.types.ts
│   │   └── api/
│   │       └── exportApi.ts
│   │
│   └── realtime-collaboration/       # "I want to collaborate in real-time"
│       ├── ui/
│       │   ├── CollaborationIndicators.vue
│       │   ├── UserPresence.vue
│       │   └── components/
│       ├── business/
│       │   ├── realtimeService.ts
│       │   ├── presenceService.ts
│       │   └── syncService.ts
│       ├── data/
│       │   └── realtimeRepository.ts
│       ├── types/
│       │   └── realtime.types.ts
│       └── api/
│           └── socketApi.ts
│
├── shared/                           # Minimal shared utilities only
│   ├── ui/
│   │   ├── AppShell.vue
│   │   └── ErrorBoundary.vue
│   ├── utils/
│   │   ├── api.ts
│   │   └── constants.ts
│   └── types/
│       └── common.types.ts
│
└── app/                              # Application bootstrap
    ├── main.ts
    ├── router.ts
    └── store.ts
```

### Backend Structure

```
backend/src/
├── slices/
│   ├── user-onboarding/              # "I want to join a retrospective"
│   │   ├── api/
│   │   │   ├── routes.ts             # POST /api/users/session, PUT /api/users/session/name
│   │   │   └── controllers.ts        # Request/response handling
│   │   ├── business/
│   │   │   ├── onboardingService.ts  # Session creation, validation logic
│   │   │   └── sessionValidator.ts   # Business rules for sessions
│   │   ├── data/
│   │   │   ├── userRepository.ts     # User CRUD operations
│   │   │   └── sessionRepository.ts  # Session persistence
│   │   └── types/
│   │       └── onboarding.types.ts   # User, Session interfaces
│   │
│   ├── team-creation/                # "I want to create and manage a team"
│   │   ├── api/
│   │   │   ├── routes.ts             # POST /api/teams, GET /api/teams/:id
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── teamService.ts        # Team creation, management logic
│   │   │   └── membershipService.ts  # Team membership rules
│   │   ├── data/
│   │   │   └── teamRepository.ts     # Team CRUD operations
│   │   └── types/
│   │       └── team.types.ts         # Team, Member interfaces
│   │
│   ├── retro-facilitation/           # "I want to facilitate a retrospective"
│   │   ├── api/
│   │   │   ├── routes.ts             # POST /api/retros, PUT /api/retros/:id/phase
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── facilitationService.ts # Session creation, phase management
│   │   │   ├── formatRegistry.ts     # Available retro formats
│   │   │   └── phaseManager.ts       # Phase transition logic
│   │   ├── data/
│   │   │   ├── retroRepository.ts    # RetroSession CRUD
│   │   │   └── formatRepository.ts   # RetroFormat CRUD
│   │   └── types/
│   │       └── facilitation.types.ts # RetroSession, RetroFormat interfaces
│   │
│   ├── retro-participation/          # "I want to participate in a retrospective"
│   │   ├── api/
│   │   │   ├── routes.ts             # POST /api/retros/:id/items, PUT /api/items/:id
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── participationService.ts # Join session, permission checks
│   │   │   ├── itemService.ts        # Item creation, validation
│   │   │   ├── votingService.ts      # Voting logic, vote limits
│   │   │   └── formatRenderer.ts     # Format-specific item positioning
│   │   ├── data/
│   │   │   ├── itemRepository.ts     # RetroItem CRUD
│   │   │   └── voteRepository.ts     # Vote CRUD
│   │   └── types/
│   │       └── participation.types.ts # RetroItem, Vote interfaces
│   │
│   ├── action-tracking/              # "I want to track action items"
│   │   ├── api/
│   │   │   ├── routes.ts             # POST /api/actions, PUT /api/actions/:id
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── actionService.ts      # Action item creation, assignment
│   │   │   └── trackingService.ts    # Status updates, notifications
│   │   ├── data/
│   │   │   └── actionRepository.ts   # ActionItem CRUD
│   │   └── types/
│   │       └── action.types.ts       # ActionItem interfaces
│   │
│   ├── retro-export/                 # "I want to export retrospective results"
│   │   ├── api/
│   │   │   ├── routes.ts             # GET /api/retros/:id/export
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── exportService.ts      # Export orchestration
│   │   │   ├── formatters/
│   │   │   │   ├── markdownFormatter.ts # Markdown export logic
│   │   │   │   ├── pdfFormatter.ts   # PDF generation
│   │   │   │   └── confluenceFormatter.ts # Confluence API integration
│   │   │   └── templateEngine.ts     # Template processing
│   │   ├── data/
│   │   │   └── exportRepository.ts   # Export history, templates
│   │   └── types/
│   │       └── export.types.ts       # Export config interfaces
│   │
│   └── realtime-collaboration/       # "I want to collaborate in real-time"
│       ├── api/
│       │   ├── socketHandlers.ts     # Socket.io event handlers
│       │   └── realtimeRoutes.ts     # WebSocket connection endpoints
│       ├── business/
│       │   ├── realtimeService.ts    # Real-time sync logic
│       │   ├── presenceService.ts    # User presence tracking
│       │   └── syncService.ts        # Data synchronization
│       ├── data/
│       │   └── realtimeRepository.ts # Real-time state persistence
│       └── types/
│           └── realtime.types.ts     # Socket event interfaces
│
├── shared/                           # Minimal shared utilities only
│   ├── middleware/
│   │   ├── auth.ts                   # Session validation middleware
│   │   ├── cors.ts                   # CORS configuration
│   │   ├── errorHandler.ts           # Global error handling
│   │   └── validation.ts             # Request validation utilities
│   ├── utils/
│   │   ├── database.ts               # Prisma client setup
│   │   ├── logger.ts                 # Logging utilities
│   │   └── constants.ts              # Shared constants
│   └── types/
│       └── common.types.ts           # Shared type definitions
│
└── app/                              # Application bootstrap
    ├── server.ts                     # Express app setup
    ├── routes.ts                     # Route registration
    └── socket.ts                     # Socket.io setup
```

## Ultra-Flexible Data Model

To support any retrospective format (not just columns), we need a completely flexible data structure:

```sql
-- Ultra-flexible retro format definition
CREATE TABLE retro_formats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    
    -- Completely flexible format definition
    layout_config JSONB NOT NULL,     -- How items are arranged/displayed
    interaction_config JSONB NOT NULL, -- What users can do (vote, drag, etc.)
    validation_rules JSONB DEFAULT '{}', -- Format-specific validation
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Flexible retro items (not tied to columns)
CREATE TABLE retro_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES retro_sessions(id) NOT NULL,
    author_id UUID REFERENCES users(id) NOT NULL,
    
    -- Core content
    content TEXT NOT NULL,
    item_type VARCHAR(100), -- Optional categorization
    
    -- Completely flexible positioning/metadata
    position_data JSONB DEFAULT '{}',  -- x,y coords, column_id, timeline_position, etc.
    metadata JSONB DEFAULT '{}',       -- Format-specific data
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Example format configurations:
INSERT INTO retro_formats (name, slug, layout_config, interaction_config) VALUES

-- Four Column Format
('Four Column', 'four-column', 
 '{
   "type": "columns",
   "columns": [
     {"id": "went_well", "title": "What went well?", "color": "#4CAF50"},
     {"id": "didnt_go_well", "title": "What didn''t go well?", "color": "#F44336"},
     {"id": "learned", "title": "What have I learned?", "color": "#2196F3"},
     {"id": "puzzles", "title": "What still puzzles me?", "color": "#FF9800"}
   ]
 }',
 '{
   "allowDragDrop": true,
   "votingEnabled": true,
   "itemCreation": "modal",
   "maxItemsPerColumn": null
 }'),

-- Timeline Format
('Timeline Retrospective', 'timeline',
 '{
   "type": "timeline",
   "timeRange": {"start": "sprint_start", "end": "sprint_end"},
   "lanes": [
     {"id": "events", "title": "What Happened", "color": "#2196F3"},
     {"id": "feelings", "title": "How We Felt", "color": "#FF9800"}
   ]
 }',
 '{
   "allowDragDrop": true,
   "votingEnabled": true,
   "itemCreation": "inline",
   "timePositioning": true
 }'),

-- Free Canvas Format
('Free Canvas', 'canvas',
 '{
   "type": "canvas",
   "dimensions": {"width": 2000, "height": 1200},
   "tools": ["sticky_note", "drawing", "text", "image"]
 }',
 '{
   "allowDragDrop": true,
   "votingEnabled": true,
   "itemCreation": "contextual",
   "freePositioning": true
 }');
```

## Simple Vue Component-Based Format Renderer System

Each slice that needs to display retro content uses a **simple Vue component-based renderer system**:

```vue
<!-- In retro-participation/ui/RetroCanvas.vue -->
<template>
  <div class="retro-canvas">
    <!-- Dynamic component based on format type -->
    <component 
      :is="formatComponent" 
      :items="items" 
      :format="format" 
      :config="config"
      @item-created="handleItemCreated"
      @item-moved="handleItemMoved"
      @item-voted="handleItemVoted"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import ColumnLayout from './components/format-renderers/ColumnLayout.vue';
import TimelineLayout from './components/format-renderers/TimelineLayout.vue';
import CanvasLayout from './components/format-renderers/CanvasLayout.vue';
import FormLayout from './components/format-renderers/FormLayout.vue';

const props = defineProps<{
  items: RetroItem[];
  format: RetroFormat;
  config: RenderConfig;
}>();

// Simple component mapping based on format type
const formatComponents = {
  'columns': ColumnLayout,
  'timeline': TimelineLayout,
  'canvas': CanvasLayout,
  'form': FormLayout,
};

const formatComponent = computed(() => {
  const formatType = props.format.layout_config.type;
  return formatComponents[formatType] || ColumnLayout; // fallback
});

const handleItemCreated = (item: RetroItem) => {
  // Handle item creation
};

const handleItemMoved = (itemId: string, newPosition: any) => {
  // Handle item movement
};

const handleItemVoted = (itemId: string, vote: Vote) => {
  // Handle voting
};
</script>
```

```vue
<!-- Example: ColumnLayout.vue -->
<template>
  <div class="column-layout">
    <div 
      v-for="column in format.layout_config.columns" 
      :key="column.id"
      class="retro-column"
      :style="{ backgroundColor: column.color }"
    >
      <h3>{{ column.title }}</h3>
      
      <div class="column-items">
        <RetroItem
          v-for="item in getItemsForColumn(column.id)"
          :key="item.id"
          :item="item"
          :config="config"
          @voted="$emit('item-voted', item.id, $event)"
        />
      </div>
      
      <button 
        @click="createItem(column.id)"
        class="add-item-btn"
      >
        + Add Item
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  items: RetroItem[];
  format: RetroFormat;
  config: RenderConfig;
}>();

const emit = defineEmits<{
  'item-created': [item: RetroItem];
  'item-moved': [itemId: string, newPosition: any];
  'item-voted': [itemId: string, vote: Vote];
}>();

const getItemsForColumn = (columnId: string) => {
  return props.items.filter(item => 
    item.position_data.column_id === columnId
  );
};

const createItem = (columnId: string) => {
  // Open modal or inline editor for item creation
  // Emit item-created event when done
};
</script>
```

```vue
<!-- Example: TimelineLayout.vue -->
<template>
  <div class="timeline-layout">
    <div class="timeline-header">
      <div class="time-markers">
        <span 
          v-for="marker in timeMarkers" 
          :key="marker.id"
          class="time-marker"
        >
          {{ marker.label }}
        </span>
      </div>
    </div>
    
    <div 
      v-for="lane in format.layout_config.lanes"
      :key="lane.id" 
      class="timeline-lane"
    >
      <h4>{{ lane.title }}</h4>
      <div class="lane-items">
        <RetroItem
          v-for="item in getItemsForLane(lane.id)"
          :key="item.id"
          :item="item"
          :config="config"
          :style="getTimelinePosition(item)"
          @voted="$emit('item-voted', item.id, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Similar setup but for timeline-specific logic
const getItemsForLane = (laneId: string) => {
  return props.items.filter(item => 
    item.position_data.lane_id === laneId
  );
};

const getTimelinePosition = (item: RetroItem) => {
  // Calculate position based on timestamp
  const timePosition = item.position_data.time_position || 0;
  return {
    left: `${timePosition}%`
  };
};
</script>
```

## Backend Slice Implementation Details

### 1. Complete API Ownership
Each slice owns its complete API surface:

```typescript
// retro-participation/api/routes.ts
import { Router } from 'express';
import { createItem, updateItem, voteOnItem, removeVote } from './controllers';

export const participationRoutes = Router();

participationRoutes.post('/retros/:id/items', createItem);
participationRoutes.put('/items/:id', updateItem);
participationRoutes.post('/items/:id/vote', voteOnItem);
participationRoutes.delete('/items/:id/vote', removeVote);
```

### 2. Independent Business Logic
Each slice contains all its business rules:

```typescript
// retro-participation/business/itemService.ts
export class ItemService {
  constructor(
    private itemRepository: ItemRepository,
    private sessionRepository: SessionRepository
  ) {}

  async createItem(sessionId: string, content: string, position: any) {
    // Validate session is in correct phase
    const session = await this.sessionRepository.findById(sessionId);
    if (session.phase !== 'collection') {
      throw new Error('Items can only be created during collection phase');
    }

    // Apply format-specific positioning rules
    const validatedPosition = this.validatePositionForFormat(
      position,
      session.format
    );

    // Create item with proper metadata
    return this.itemRepository.create({
      sessionId,
      content,
      positionData: validatedPosition,
      metadata: { createdInPhase: session.phase }
    });
  }

  async moveItem(itemId: string, newPosition: any) {
    const item = await this.itemRepository.findById(itemId);
    const session = await this.sessionRepository.findById(item.sessionId);
    
    // Validate move is allowed by format
    if (!this.isValidMoveForFormat(newPosition, session.format)) {
      throw new Error('Invalid position for this retro format');
    }

    // Update position_data JSON field
    await this.itemRepository.updatePosition(itemId, newPosition);
    
    // Emit real-time update
    eventBus.emit('retro.item.moved', {
      itemId,
      sessionId: item.sessionId,
      newPosition
    });
  }
}
```

### 3. Format-Agnostic Data Layer
Ultra-flexible repositories that work with any retro format:

```typescript
// retro-participation/data/itemRepository.ts
export class ItemRepository {
  async createItem(item: CreateItemData) {
    return prisma.retroItem.create({
      data: {
        ...item,
        positionData: item.positionData, // JSON field - any structure
        metadata: item.metadata         // JSON field - format-specific
      }
    });
  }

  async getItemsByPosition(sessionId: string, positionQuery: any) {
    // Query JSON fields flexibly for any format
    return prisma.retroItem.findMany({
      where: {
        sessionId,
        positionData: {
          path: positionQuery.path,
          equals: positionQuery.value
        }
      }
    });
  }

  async updatePosition(itemId: string, newPosition: any) {
    return prisma.retroItem.update({
      where: { id: itemId },
      data: {
        positionData: newPosition,
        updatedAt: new Date()
      }
    });
  }
}
```

### 4. Event-Driven Slice Communication
Slices communicate through domain events for loose coupling:

```typescript
// shared/utils/eventBus.ts
import { EventEmitter } from 'events';
export const eventBus = new EventEmitter();

// retro-participation/business/itemService.ts
async createItem(data: CreateItemData) {
  const item = await this.itemRepository.create(data);
  
  // Notify other slices
  eventBus.emit('retro.item.created', {
    itemId: item.id,
    sessionId: item.sessionId,
    authorId: item.authorId,
    content: item.content
  });
  
  return item;
}

// realtime-collaboration/business/realtimeService.ts
eventBus.on('retro.item.created', (event) => {
  // Broadcast to all connected clients in the session
  this.broadcastToSession(event.sessionId, 'item:created', {
    item: event,
    timestamp: new Date().toISOString()
  });
});

// action-tracking/business/actionService.ts
eventBus.on('retro.item.created', (event) => {
  // Check if item content suggests an action item
  if (this.isActionItemCandidate(event.content)) {
    this.suggestActionItem(event.sessionId, event.content);
  }
});
```

### 5. Independent Deployment Capability
Each slice could theoretically be deployed as a separate microservice:

```typescript
// retro-participation/api/standalone.ts (hypothetical)
import express from 'express';
import { participationRoutes } from './routes';
import { setupDatabase } from '../data/setup';

const app = express();
app.use('/api', participationRoutes);

// Could run as separate service if needed
if (process.env.STANDALONE_MODE) {
  setupDatabase();
  app.listen(3002, () => {
    console.log('Participation service running on port 3002');
  });
}
```

## Benefits of True Vertical Slices

1. **Independent Development**: Teams can work on different user capabilities without conflicts
2. **Independent Deployment**: Each slice can be deployed separately (micro-frontends/microservices)
3. **Technology Flexibility**: Different slices could use different tech if needed
4. **User-Centric**: Each slice delivers complete user value
5. **Format Agnostic**: New retrospective formats don't require architectural changes
6. **Testability**: Each slice can be tested in isolation
7. **Scalability**: Slices can be scaled independently based on usage
8. **Maintainability**: Bug fixes and features are contained within specific slices

## Slice Communication Patterns

### Frontend Communication
```typescript
// Frontend slices communicate through:
// 1. Pinia stores (minimal shared state)
// 2. Event bus for cross-slice notifications
// 3. Direct API calls to backend slices

// Event-driven communication
eventBus.emit('retro.item.created', { itemId, sessionId });
eventBus.emit('user.joined.session', { userId, sessionId });
eventBus.emit('phase.changed', { sessionId, newPhase });
```

### Backend Communication
```typescript
// Backend slices communicate through:
// 1. Domain events (EventEmitter)
// 2. Shared database (minimal coupling)
// 3. Direct service calls (when absolutely necessary)

// Domain events for loose coupling
eventBus.emit('retro.session.phase.changed', {
  sessionId,
  oldPhase,
  newPhase,
  facilitatorId
});

eventBus.emit('retro.item.voted', {
  itemId,
  userId,
  voteCount
});
```

## Format Flexibility Examples

### Adding a New "Mood Board" Format
```typescript
// 1. Add format definition to database
const moodBoardFormat = {
  name: "Mood Board",
  slug: "mood-board",
  layoutConfig: {
    type: "canvas",
    dimensions: { width: 1600, height: 1200 },
    tools: ["image", "emoji", "text", "drawing"],
    zones: [
      { id: "happy", area: { x: 0, y: 0, w: 800, h: 600 }, color: "#4CAF50" },
      { id: "sad", area: { x: 800, y: 0, w: 800, h: 600 }, color: "#F44336" },
      { id: "confused", area: { x: 0, y: 600, w: 800, h: 600 }, color: "#FF9800" },
      { id: "excited", area: { x: 800, y: 600, w: 800, h: 600 }, color: "#2196F3" }
    ]
  },
  interactionConfig: {
    allowDragDrop: true,
    votingEnabled: false,
    itemCreation: "contextual",
    imageUpload: true,
    emojiPicker: true
  }
};

// 2. Create new renderer component (frontend only)
// frontend/src/slices/retro-participation/ui/components/format-renderers/MoodBoardRenderer.vue

// 3. Register component (frontend only)
const formatComponents = {
  'columns': ColumnLayout,
  'timeline': TimelineLayout,
  'canvas': CanvasLayout,
  'mood-board': MoodBoardRenderer, // New format
  'form': FormLayout,
};

// No backend changes needed! The ultra-flexible schema handles it.
```

This architecture truly supports any retrospective format while maintaining clean separation and independent development capabilities across both frontend and backend using modern, scalable patterns.