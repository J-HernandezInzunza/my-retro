# User Onboarding Slice

## Purpose

This slice handles user identification and team assignment using a **WebSocket-first** session-based identification system. It manages user session creation, display name collection, and team association without requiring traditional authentication, prioritizing real-time communication over HTTP requests.

## Architecture

**WebSocket-First Approach**: All session operations (initialize, update name, join team) are performed via WebSocket events rather than HTTP requests. This ensures consistent real-time communication.

## Responsibilities

- WebSocket-based session initialization and management
- Real-time user identification and display name updates
- Team assignment/joining via WebSocket events
- Session token-based authentication
- Multi-step onboarding flow coordination
- Shared type system integration with backend

## Directory Structure

```text
user-onboarding/
├── index.ts                          # Public API exports
├── README.md                         # Slice documentation
├── components/
│   ├── OnboardingView.vue           # Main orchestrator component
│   ├── UserIdentificationForm.vue   # Display name collection
│   ├── TeamJoinForm.vue             # Team selection/joining
│   └── OnboardingCompletion.vue     # Success completion state
└── stores/
    └── userSessionStore.ts          # Pinia store with WebSocket integration
```

## Key Components

### `OnboardingView.vue`

Main orchestrator that manages the multi-step onboarding flow:

- **Loading** → **Identification** → **Team Join** → **Completed**
- Handles step transitions and error states
- Coordinates between form components

### `UserIdentificationForm.vue`

Collects and validates user display name:

- Real-time validation
- WebSocket-based name updates
- Error handling and loading states

### `TeamJoinForm.vue`

Manages team selection and joining:

- Team discovery and selection
- WebSocket-based team joining
- Back navigation support

### `OnboardingCompletion.vue`

Success state component:

- Completion confirmation
- Navigation to next application phase

## WebSocket Integration

### Session Events

- `session:initialize` - Create/restore user session with optional display name
- `session:update-name` - Update user display name
- `session:join-team` - Join a team by ID
- `session:updated` - Real-time session updates (server → client)
- `session:online-users` - Real-time online user list updates

### Authentication Flow

1. Initialize session via WebSocket
2. Receive session token from server
3. Store token in socket service for subsequent requests
4. All further operations use token-based auth

## State Management (`userSessionStore.ts`)

### Actions

- `initializeUserSession(data?)` - Initialize session with optional display name
- `updateDisplayName(name)` - Update user's display name via WebSocket
- `joinTeam(teamId)` - Join team via WebSocket
- `reset()` - Reset store state without clearing backend session

### Getters

- `isIdentified` - Check if user has provided display name
- `hasTeam` - Check if user has joined a team
- `isOnboarded` - Check if user completed full onboarding
- `displayName` - Get current display name
- `teamId` - Get current team ID
- `sessionId` - Get current session ID

### State Structure

```typescript
interface UserSessionState {
  userSession: {
    isLoading: boolean;
    data: UserSession | null;
    error: string | null;
  }
}
```

## Shared Types Integration

Uses shared types from `/frontend/src/shared/types/user-session.ts`:

- `UserSession` - Core session data structure
- `UserSessionInitializeRequest` - Session initialization payload
- `UserSessionUpdateRequest` - Session update payload
- `SESSION_EVENTS` - WebSocket event constants

## Error Handling

- WebSocket connection failures
- Session initialization errors
- Display name validation errors
- Team joining failures
- Automatic error state management in store

## Integration Points

### Socket Service

- Uses global `socketService` for WebSocket communication
- Token-based authentication integration
- Async event emission with response handling

### Router Integration

- Onboarding completion triggers navigation
- Route guards can check onboarding status via store getters

## Future Enhancements

- Team creation functionality
- Invite-based team joining
- User avatar/profile customization
- Onboarding progress persistence
- Multi-language support
