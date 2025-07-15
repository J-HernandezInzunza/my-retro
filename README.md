# My Retro - Team Retrospective Tool

A modern, in-house retrospective tool designed for distributed teams with hybrid workflow support.

## Overview

My Retro is a web-based application that enables teams to conduct effective retrospectives with both asynchronous item collection and real-time discussion phases. Built with a **True Vertical Slice Architecture**, it provides a scalable and maintainable platform for team reflection and continuous improvement.

## Key Features

- **Format-Agnostic Renderers**: Supports multiple retrospective formats (columns, timeline, canvas, forms).
- **Hybrid Workflow**: Async item collection + real-time discussion phases.
- **Real-time Collaboration**: Live updates and collaboration during discussion phase.
- **Voting System**: Upvote items to prioritize discussion topics.
- **Action Items**: Track and manage follow-up actions.
- **Session Management**: Facilitator controls for phase transitions.

## Technology Stack

- **Frontend**: Vue 3 + Composition API + Quasar Framework + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Real-time**: Socket.io
- **Database**: PostgreSQL + Prisma ORM
- **Build Tool**: Vite
- **Package Manager**: `pnpm` (recommended)

## Project Management

This project is managed in Linear for task tracking and project coordination.

**📋 [View Project in Linear](https://linear.app/j-hernandez/project/my-retro-project-ded216c01eb1)**

## Getting Started

To get started with development, please follow the **[Onboarding Guide](./docs/ONBOARDING.md)**. It contains all the necessary steps for environment setup, installation, and running the application.

## Documentation

All project documentation is located in the `docs/` directory.

- **[🚀 Onboarding Guide](./docs/ONBOARDING.md)**: A step-by-step guide to get your development environment set up and start contributing.
- **[🏛️ Architecture Overview](./docs/ARCHITECTURE.md)**: An in-depth explanation of the True Vertical Slice Architecture and design principles.

## Project Structure

```text
my-retro/
├── docs/               # Project documentation
│   ├── ARCHITECTURE.md
│   └── ONBOARDING.md
├── backend/            # Node.js + Express backend
├── frontend/           # Vue 3 + Quasar frontend
└── README.md           # This file
└── TODO.md             # Work in progress
```

- [System Architecture Diagrams](./docs/system-architecture-diagram.md)
- [Alternative Architecture Approach](./docs/true-vertical-slice-architecture.md)

## Contributing

1. Check the [Linear project](https://linear.app/j-hernandez/project/my-retro-project-ded216c01eb1) for current tasks
2. Update [`TODO.md`](./TODO.md) as you complete tasks
3. Follow the development phases outlined in the todo list
4. Reference architecture documents for implementation guidance

## License

[Add your license here]

---

**Project Links:**
- 📋 [Linear Project](https://linear.app/j-hernandez/project/my-retro-project-ded216c01eb1)
- 📝 [Development Todo List](./TODO.md)
- 🏗️ [Architecture Documentation](./docs/retro-tool-architecture.md)