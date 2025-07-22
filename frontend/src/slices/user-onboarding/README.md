# User Onboarding Slice

## Purpose

This slice handles user identification and team assignment using a session-based identification system. It manages user creation and team association without requiring traditional authentication.

## Responsibilities

- Session-based user identification
- User name collection and validation
- Team assignment/joining
- Creating new user sessions
- Session persistence and management
- Real-time online users display

## Directory Structure

```text
user-onboarding/
├── index.ts                     # Public API exports
├── README.md                    # Slice documentation
├── api/
│   └── user-session.api.ts      # API calls to session endpoints
├── components/
│   ├── UserIdentificationForm.vue  # For collecting user name
│   └── SessionJoinForm.vue      # For joining team sessions
├── store/
│   └── userSessionStore.ts      # Pinia store for session state
├── types/
│   └── index.ts                 # TypeScript definitions
└── views/
    └── OnboardingView.vue       # Main view for user onboarding
```

## Key Components

- `UserIdentificationForm.vue` - Collects user display name
- `TeamJoinForm.vue` - Allows users to join existing teams
- `OnboardingView.vue` - Main view that coordinates the onboarding flow

## Key Services

- `user-session.api.ts` - API client for backend session endpoints
- `userSessionStore.ts` - Pinia store for session state management

## Backend API Integration

- `/api/user-session/initialize` - Create new session
- `/api/user-session/update-name` - Update display name
- `/api/user-session/join-team` - Join team session

## Socket.io Integration

- Session authentication via socket handshake
- Real-time online users display
- Connection status management

## Types

- `UserSession` - User session data structure that mirrors backend model

## Routes

- `/start` - New session creation
- `/join/:teamId` - Join existing team

## State Management

- Session creation and persistence
- Display name management
- Team membership tracking
- Online user status

## Routes (Future Implementation)

- `/join` - Join existing session
- `/start` - Start new session

## State Management (Future Implementation)

- Current user session
- Session joining status
