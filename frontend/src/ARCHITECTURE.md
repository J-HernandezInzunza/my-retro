# Frontend Architecture: True Vertical Slice Architecture

## Overview

This frontend follows a **True Vertical Slice Architecture** where features are organized by user capabilities rather than technical layers. Each slice contains all the code needed to deliver a complete user capability.

## Directory Structure

```
src/
├── app/                     # Application core
│   ├── main.ts              # Application entry point
│   ├── router/              # Vue Router configuration
│   └── store.ts             # Global state management
├── assets/                  # Static assets
├── slices/                  # Feature slices (vertical slices)
│   ├── user-onboarding/     # User identification & session joining
│   ├── team-creation/       # Team setup & configuration
│   ├── retro-facilitation/  # Facilitator controls & session management
│   ├── retro-participation/ # Participant interactions
│   ├── action-tracking/     # Action item creation & follow-up
│   ├── retro-export/        # Data export & reporting
│   └── realtime-collaboration/ # Real-time updates & collaboration
└── shared/                  # Shared utilities & components
    ├── ui/                  # Reusable UI components
    ├── utils/               # Utility functions
    └── types/               # TypeScript type definitions
```

## Slice Architecture Principles

### 1. Self-Contained Slices

Each slice contains everything needed for its user capability:

- Components (Vue components)
- Services (API calls, business logic)
- Types (TypeScript definitions)
- Composables (Vue composition functions)
- Tests (unit and integration tests)

### 2. Minimal Cross-Slice Dependencies

- Slices should not directly import from other slices
- Shared functionality goes in the `shared/` directory
- Communication between slices happens through:
  - Global state management
  - Event bus
  - URL routing

### 3. Feature-Oriented Organization

Each slice represents a complete user journey or capability:

- **user-onboarding**: Getting users into sessions
- **team-creation**: Setting up teams and configurations
- **retro-facilitation**: Running and managing retrospectives
- **retro-participation**: Participating in retrospectives
- **action-tracking**: Managing action items
- **retro-export**: Exporting data and reports
- **realtime-collaboration**: Live collaboration features

## Technology Stack

- **Framework**: Vue 3 with Composition API
- **Build Tool**: Vite
- **UI Library**: Quasar Framework
- **Language**: TypeScript
- **Routing**: Vue Router 4
- **State Management**: Pinia

## Format Flexibility

The architecture supports multiple retrospective formats through a component-based renderer system:

- **ColumnRenderer**: Traditional 4-column layouts
- **TimelineRenderer**: Timeline-based retrospectives
- **CanvasRenderer**: Free-form canvas layouts
- **FormRenderer**: Structured questionnaire formats

## Development Guidelines

### 1. Creating New Features

1. Identify which slice the feature belongs to
2. If it's a new capability, create a new slice
3. Implement all related code within the slice
4. Extract shared functionality to `shared/` if needed

### 2. Slice Structure

Each slice should follow this internal structure:

```
slice-name/
├── index.ts              # Public API exports
├── README.md             # Slice documentation
├── components/           # Vue components
├── composables/          # Vue composition functions
├── services/             # API calls and business logic
├── types/                # TypeScript definitions
└── __tests__/            # Tests
```

### 3. Import Rules

- ✅ Slice can import from `shared/`
- ✅ Slice can import from `app/`
- ❌ Slice cannot import from other slices
- ✅ `shared/` can import from external libraries
- ❌ `shared/` cannot import from slices

### 4. State Management

- Global state for cross-slice communication
- Local state within slices for slice-specific data
- Use composables for state logic within slices

## Migration Strategy

The current Vue project structure will be gradually migrated:

1. **Phase 1**: Create slice structure (✅ Complete)
2. **Phase 2**: Move existing components to appropriate slices
3. **Phase 3**: Implement slice-specific features
4. **Phase 4**: Remove legacy structure

## Benefits

1. **Maintainability**: Features are self-contained and easy to understand
2. **Scalability**: New features can be added without affecting existing ones
3. **Team Collaboration**: Different teams can work on different slices
4. **Testing**: Each slice can be tested independently
5. **Deployment**: Slices can potentially be deployed independently
6. **Format Flexibility**: Easy to add new retrospective formats

## Future Considerations

- **Micro-frontends**: Slices could evolve into separate micro-frontends
- **Lazy Loading**: Slices can be lazy-loaded for better performance
- **Feature Flags**: Enable/disable slices based on configuration
- **A/B Testing**: Test different implementations within slices
