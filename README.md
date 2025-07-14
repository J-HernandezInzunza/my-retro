# My Retro - Team Retrospective Tool

A modern, in-house retrospective tool designed for distributed teams with hybrid workflow support.

## Overview

My Retro is a web-based application that enables teams to conduct effective retrospectives with both asynchronous item collection and real-time discussion phases. Built with modern technologies, it provides a seamless experience for team reflection and continuous improvement.

## Key Features

- **4-Column Retrospective Layout**: What went well, What didn't go well, What have I learned, What still puzzles me
- **Hybrid Workflow**: Async item collection + real-time discussion phases
- **Real-time Collaboration**: Live updates and collaboration during discussion phase
- **Voting System**: Upvote items to prioritize discussion topics
- **Drag & Drop**: Move items between columns easily
- **Action Items**: Track and manage follow-up actions
- **Session Management**: Facilitator controls for phase transitions
- **Export Functionality**: Export results to Markdown, JSON, CSV, and Confluence

## Technology Stack

- **Frontend**: Vue 3 + Composition API + Quasar Framework + TypeScript
- **Backend**: Node.js + Express + TypeScript
- **Real-time**: Socket.io
- **Database**: PostgreSQL + Prisma ORM
- **Build Tool**: Vite

## Project Management

This project is managed in Linear for task tracking and project coordination.

**📋 [View Project in Linear](https://linear.app/j-hernandez/project/my-retro-project-ded216c01eb1)**

## Getting Started

### Prerequisites

- Node.js 22+
- PostgreSQL 14+
- npm or yarn

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd my-retro
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Set up database**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Start development servers**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm run dev
   ```

## Project Structure

```
my-retro/
├── frontend/          # Vue 3 + Quasar frontend
├── backend/           # Node.js + Express backend
├── docs/              # Architecture and planning documents
│   ├── retro-tool-architecture.md
│   ├── system-architecture-diagram.md
│   └── true-vertical-slice-architecture.md
├── TODO.md            # Development task tracking
└── README.md          # This file
```

## Development Progress

See [`TODO.md`](./TODO.md) for detailed development progress and task tracking.

## Architecture

For detailed architecture information, see:
- [Main Architecture Document](./docs/retro-tool-architecture.md)
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