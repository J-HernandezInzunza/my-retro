# Developer Onboarding Guide

Welcome to the My Retro project! This guide will help you get your development environment set up and introduce you to our development workflow.

## 1. Project Overview

My Retro is a flexible, real-time retrospective tool designed to support various formats beyond the traditional column-based approach. It is built using a Vertical Slice Architecture to ensure features are modular, independently maintainable, and user-centric.

- **Frontend**: Vue 3, TypeScript, Quasar, Vite
- **Backend**: Node.js, Express, TypeScript

## 2. Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v22.x or later recommended)
- [pnpm](https://pnpm.io/) (or npm/yarn, though pnpm is preferred for managing dependencies)

## 3. Getting Started

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd my-retro
```

### Step 2: Install Dependencies

Install dependencies for both the frontend and backend projects from the root directory.

```bash
# Install frontend dependencies
cd frontend
pnpm install

# Install backend dependencies
cd ../backend
pnpm install
```

### Step 3: Environment Variables

Both the frontend and backend may require environment variables. Create a `.env` file in both the `frontend` and `backend` directories by copying the respective `.env.example` files.

```bash
# In the frontend directory
cp .env.example .env

# In the backend directory
cp .env.example .env
```

Fill in the required environment variables as described in the example files.

### Step 4: Run the Application

You will need two separate terminal sessions to run the frontend and backend servers concurrently.

#### Terminal 1: Start the Frontend (Vite)

```bash
cd frontend
pnpm run dev
```

The frontend will be available at `http://localhost:3000` (or the next available port).

#### Terminal 2: Start the Backend (Express/Node)

```bash
cd backend
pnpm run dev
```

The backend API will be running on the port specified in your backend `.env` file (e.g., `http://localhost:4000`).

## 4. Project Structure

Our project follows a **True Vertical Slice Architecture**. This is a critical concept to understand before contributing. Please read the detailed explanation in our architecture document.

- **[Read the Architecture Document](./ARCHITECTURE.md)**

## 5. Development Workflow

### Creating a New Feature

1. **Identify the Slice**: Determine if the feature fits into an existing user capability (slice) or requires a new one.
2. **Create/Update Slice**: Add your components, views, services, and types within the appropriate slice directory in both the `frontend` and `backend`.
3. **Keep it Contained**: Avoid creating unnecessary dependencies between slices. If functionality is truly shared, add it to the `shared` directory after discussion with the team.

### Branching and Pull Requests

1. **Create a Feature Branch**: Branch off `main` for your new feature (e.g., `feature/J-XX-new-feature-name`).
2. **Commit Your Changes**: Follow conventional commit message standards.
3. **Push and Create a Pull Request**: Push your branch to the remote and open a Pull Request (PR) targeting the `main` branch.
4. **Code Review**: At least one other developer must approve the PR before it can be merged.

## 6. Coding Standards

We enforce coding standards using ESLint and Prettier.

- **To Lint Files**: `pnpm run lint`
- **To Format Files**: `pnpm run format`

Please ensure your code is linted and formatted before committing.
