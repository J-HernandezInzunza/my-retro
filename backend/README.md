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

## Running the Application

To run the server in development mode with hot-reloading, use:

```sh
npm run dev
```

The server will be running on `http://localhost:3001` (or the port specified in your `.env` file).

## Project Structure

This project follows a **True Vertical Slice Architecture**. Features are organized by user capabilities, not by technical layers. Each slice is self-contained and includes its own routes, services, and data access logic.

- `src/app/core`: Core application setup, including the server, database connection (Prisma), and WebSocket initialization.
- `src/slices`: Contains the vertical slices. Each slice directory represents a feature.
  - `user-onboarding/`: Handles user registration, login, etc.
  - `retrospective-board/`: Manages retrospective boards.
  - `session-management/`: Handles user sessions.
- `src/generated`: Contains the auto-generated Prisma client.
- `prisma`: Contains the Prisma schema file (`schema.prisma`) and migrations.
