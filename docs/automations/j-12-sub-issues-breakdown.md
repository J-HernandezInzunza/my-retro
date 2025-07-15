# Plan: Breakdown of J-12 - Backend Setup

This document breaks down the Linear issue **J-12: Setup Node.js Backend with Express + Socket.io + PostgreSQL** into smaller, manageable sub-issues. Each sub-issue is designed to be a self-contained learning step, especially for new technologies like Prisma and Socket.io.

---

### Sub-Issue 1: Project Initialization & Basic Express Server

**Goal:** Set up the initial Node.js project, configure TypeScript, and get a basic Express server running with a health check endpoint.

**Tasks:**
1.  Create the `backend/` directory and initialize a `package.json` file.
2.  Install TypeScript, `ts-node-dev`, and Express (`express`, `@types/express`).
3.  Create a `tsconfig.json` file for the project.
4.  Set up the basic directory structure: `backend/src/app/server.ts`.
5.  Write the initial Express server code in `server.ts`.
6.  Add a health check endpoint at `/api/health` that returns a `200 OK` status.
7.  Install and configure `cors` middleware to allow requests from the frontend (port 3000).
8.  Add an `npm run dev` script to `package.json` using `ts-node-dev` for hot reloading.

---

### Sub-Issue 2: Prisma & PostgreSQL Integration

**Goal:** Connect the backend to a PostgreSQL database using the Prisma ORM.

**Learning Resource:**
-   **Prisma Docs:** [Quickstart with TypeScript & PostgreSQL](https://www.prisma.io/docs/getting-started/quickstart-prismaPostgres)

**Tasks:**
1.  Install Prisma CLI (`prisma`) and Prisma Client (`@prisma/client`).
2.  Install the PostgreSQL driver (`pg`).
3.  Initialize Prisma by running `npx prisma init`. This will create a `prisma/` directory and a `.env` file.
4.  Configure the `DATABASE_URL` in the `.env` file to point to your PostgreSQL instance.
5.  Define a simple `User` model in the `prisma/schema.prisma` file to start.
6.  Run your first database migration with `npx prisma migrate dev --name init` to create the `User` table.
7.  Create a simple test route (e.g., `/api/users`) to verify that the Prisma Client can successfully query the database.

---

### Sub-Issue 3: Basic Socket.io Integration

**Goal:** Integrate Socket.io into the Express server for basic real-time communication.

**Learning Resource:**
-   **Socket.io Docs:** [Get Started with Express](https://socket.io/docs/v4/tutorial/introduction)

**Tasks:**
1.  Install Socket.io (`socket.io`).
2.  Update `server.ts` to integrate Socket.io with the existing HTTP server, as shown in the tutorial.
3.  Configure Socket.io CORS options to allow connections from the frontend.
4.  Create a basic connection listener that logs a message when a new client connects (`io.on('connection', ...)`).
5.  Set up a simple test event (e.g., a "ping" event) that the client can send and the server can respond to, confirming that the real-time connection works.

---

### Sub-Issue 4: Finalizing Structure & Environment

**Goal:** Organize the code into the Vertical Slice Architecture and finalize environment configuration.

**Tasks:**
1.  Create the initial slice directories inside `backend/src/slices/` as outlined in the `J-12` description (e.g., `user-onboarding`, `realtime-collaboration`).
2.  Refactor the existing routes and services into the appropriate slices. For example, the test user route belongs in `user-onboarding`.
3.  Create a `.env.example` file based on your `.env` to document required environment variables.
4.  Add a `README.md` to the `backend/` directory with setup and run instructions.
