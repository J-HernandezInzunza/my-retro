# My Retro Backend

This is the backend for the My Retro application, a real-time retrospective tool.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v22 or higher)
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set up environment variables:**

   Create a `.env` file in the `backend` directory by copying the example file:

   ```sh
   cp .env.example .env
   ```

   Update the `.env` file with your PostgreSQL database connection details.

3. **Run database migrations:**

   This command creates the necessary tables in your database and generates the Prisma Client.

   ```sh
   npx prisma migrate dev
   ```

4. **Seed the database (Optional):**

   This will populate your database with initial data (e.g., retrospective formats and a sample team) for development.

   ```sh
   npm run seed
   ```

### Key Prisma Commands

It's important to understand the difference between the two main Prisma commands you will use:

| Command | What it Changes | When to Use |
| :--- | :--- | :--- |
| **`npx prisma migrate dev`** | The **Database** (and then runs `generate`) | When you change your database models in `schema.prisma`. |
| **`npx prisma generate`** | **Code/Files** in your project (Prisma Client, JSON schemas) | Automatically as part of `npm run build`, or manually after a schema change if you're not migrating the database. |

In short: `migrate dev` is for changing your database, and `generate` is for updating the code that reads from it.

## Running the Application

To run the server in development mode with hot-reloading, use:

```sh
npm run dev
```

The server will be running on `http://localhost:3001` (or the port specified in your `.env` file).

## API Documentation

This project uses **Swagger/OpenAPI** for API documentation, which is automatically generated from the source code.

### Viewing the Documentation

When the development server is running, you can access the interactive Swagger UI at:

[http://localhost:3001/api-docs](http://localhost:3001/api-docs)

### How It Works

The documentation is generated from two primary sources:

1. **Endpoint Definitions**: Endpoints are documented using **JSDoc comments** directly above the route definitions in the `src/slices/**/*.routes.ts` files. This keeps the documentation co-located with the feature code, in line with the Vertical Slice Architecture.
2. **Data Schemas**: The data models (e.g., `User`, `RetroSession`) are defined in `prisma/schema.prisma`. A generator automatically creates JSON schemas from these models.

### Developer Workflow

To keep the documentation up-to-date, please follow these steps:

1. **When adding or modifying an endpoint**: Add or update the JSDoc comments in the relevant `*.routes.ts` file. The server will automatically pick up these changes on restart.
2. **When changing a data model**: After modifying `prisma/schema.prisma`, you must regenerate the JSON schemas. This is now automated as part of the build process.

   To build the project and ensure schemas are updated, run:

   ```sh
   npm run build
   ```

   This command runs `prisma generate` before compiling the TypeScript code. For development, you can also run `npx prisma generate` manually after a schema change.

## Project Structure

This project follows a **True Vertical Slice Architecture**. Features are organized by user capabilities, not by technical layers. Each slice is self-contained and includes its own routes, services, and data access logic.

- `src/app/core`: Core application setup, including the server, database connection (Prisma), and WebSocket initialization.
- `src/slices`: Contains the vertical slices. Each slice directory represents a feature.
  - `user-onboarding/`: Handles user registration, login, etc.
  - `retrospective-board/`: Manages retrospective boards.
  - `session-management/`: Handles user sessions.
- `src/generated`: Contains the auto-generated Prisma client.
- `prisma`: Contains the Prisma schema file (`schema.prisma`) and migrations.
