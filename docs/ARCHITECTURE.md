# True Vertical Slice Architecture for Retrospective Tool

## What is True Vertical Slice Architecture?

A **true vertical slice** contains everything needed to deliver a complete user capability from UI to database. Each slice should be:

1. **Independently deployable** - Can work without other slices
2. **End-to-end complete** - Contains all layers (UI, business logic, data)
3. **User-centric** - Organized around user capabilities, not technical concerns
4. **Minimally coupled** - Shares as little as possible with other slices

## Core Insight: Retrospectives Beyond Columns

Future retrospectives might not follow column patterns at all. Consider these formats:

- **Timeline retrospectives** (events on a timeline)
- **Mood board retrospectives** (visual/image-based)
- **Voting-only retrospectives** (just vote on pre-defined topics)
- **Free-form retrospectives** (canvas-style with sticky notes anywhere)
- **Structured questionnaires** (form-based with specific questions)

This requires a **completely flexible data model** and **format-agnostic architecture**.

## True Vertical Slices by User Capabilities

### Frontend Structure

```text
frontend/src/
├── slices/
│   ├── user-onboarding/              # "I want to join a retrospective"
│   │   ├── ui/
│   │   │   ├── components/
│   │   │   └── views/
│   │   │       ├── IdentifyView.vue
│   │   │       └── JoinSessionView.vue
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
│   │   │   ├── components/
│   │   │   └── views/
│   │   │       ├── CreateTeamView.vue
│   │   │       └── ManageTeamView.vue
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
│   │   │   ├── components/
│   │   │   │   ├── PhaseControls.vue
│   │   │   │   └── SessionSettings.vue
│   │   │   └── views/
│   │   │       ├── CreateRetroView.vue
│   │   │       ├── FacilitatorDashboard.vue
│   │   │       └── FormatSelector.vue
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
│   │   │   ├── components/
│   │   │   │   ├── ItemCreator.vue
│   │   │   │   ├── VotingInterface.vue
│   │   │   │   └── format-renderers/
│   │   │   │       ├── RetroRenderer.vue
│   │   │   │       ├── ColumnRenderer.vue
│   │   │   │       ├── TimelineRenderer.vue
│   │   │   │       ├── CanvasRenderer.vue
│   │   │   │       └── FormRenderer.vue
│   │   │   └── views/
│   │   │       └── ParticipantView.vue
│   │   ├── business/
│   │   │   ├── participationService.ts
│   │   │   ├── itemService.ts
│   │   │   └── votingService.ts
│   │   ├── data/
│   │   │   ├── itemRepository.ts
│   │   │   └── voteRepository.ts
│   │   ├── types/
│   │   │   └── participation.types.ts
│   │   └── api/
│   │       └── participationApi.ts
│   │
│   └── ... (other slices like action-tracking, retro-export, etc.)
│
├── shared/                           # Minimal shared utilities only
│   ├── ui/
│   │   ├── MainLayout.vue
│   │   └── ErrorBoundary.vue
│   ├── utils/
│   │   ├── api.ts
│   │   └── constants.ts
│   └── types/
│       └── common.types.ts
│
└── app/                              # Application bootstrap
    ├── App.vue
    ├── main.ts
    ├── router.ts
    └── store.ts
```

### Backend Structure

The backend follows a similar slice structure, mirroring the frontend capabilities.

```text
backend/src/
├── slices/
│   ├── user-onboarding/
│   │   ├── api/
│   │   │   ├── routes.ts
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   └── onboardingService.ts
│   │   ├── data/
│   │   │   └── userRepository.ts
│   │   └── types/
│   │       └── onboarding.types.ts
│   │
│   ├── retro-participation/
│   │   ├── api/
│   │   │   ├── routes.ts
│   │   │   └── controllers.ts
│   │   ├── business/
│   │   │   ├── itemService.ts
│   │   │   └── votingService.ts
│   │   ├── data/
│   │   │   └── itemRepository.ts
│   │   └── types/
│   │       └── participation.types.ts
│   │
│   └── ... (other slices)
│
├── shared/
│   ├── middleware/
│   ├── utils/
│   └── types/
│
└── server.ts # Main server entry point
```

## Format-Agnostic Renderer System

The core of the participation slice is the `RetroRenderer.vue` component. It acts as a factory, dynamically loading the correct renderer based on the retrospective's format.

### Example: `RetroRenderer.vue`

```vue
<template>
  <component :is="currentRenderer" v-bind="props" />
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';
import type { RetroSession } from '@/slices/retro-participation/types';

const props = defineProps<{ 
  session: RetroSession;
  readonly: boolean;
}>();

const rendererMap = {
  columns: defineAsyncComponent(() => import('./format-renderers/ColumnRenderer.vue')),
  timeline: defineAsyncComponent(() => import('./format-renderers/TimelineRenderer.vue')),
  canvas: defineAsyncComponent(() => import('./format-renderers/CanvasRenderer.vue')),
  form: defineAsyncComponent(() => import('./format-renderers/FormRenderer.vue')),
};

const currentRenderer = computed(() => {
  const type = props.session.format.type; // e.g., 'columns'
  return rendererMap[type] || rendererMap.columns;
});
</script>
```

### Example Usage in a View

```vue
<template>
  <div class="participant-view">
    <h1>{{ session.title }}</h1>
    <RetroRenderer :session="session" :readonly="isReadOnly" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import RetroRenderer from '@/slices/retro-participation/ui/components/format-renderers/RetroRenderer.vue';
import type { RetroSession } from '@/slices/retro-participation/types';

const session = ref<RetroSession>(/* fetched session data */);
const isReadOnly = ref(false);
</script>
```
