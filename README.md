# Aurapex Next

A modern monorepo application managed with [Turborepo](https://turbo.build/repo/docs).

## Prerequisites

- Node.js >= 20.0.0
- npm >= 11.5.1
- Docker & Docker Compose (for local database and infrastructure)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start Docker infrastructure**
   Ensure Docker Desktop is running, then start the services:
   ```bash
   npm run docker:up
   ```

3. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   npm run db:seed
   ```
   *(Note: If you need to completely wipe the database for a fresh start, run `cd apps/api && npx prisma migrate reset --force` instead).*

4. **Run the development server**
   ```bash
   npm run dev
   ```

## Available Scripts

This project uses Turborepo to run scripts efficiently across all packages and apps:

- `npm run dev`: Starts the development servers for all apps.
- `npm run build`: Builds all apps and packages.
- `npm run lint`: Lints the codebase.
- `npm run type-check`: Runs TypeScript compiler checks.
- `npm run test`: Runs unit tests.
- `npm run test:e2e`: Runs end-to-end tests.
- `npm run clean`: Cleans up node_modules and build artifacts.

## Database Management (Prisma)

Database commands are specific to the `api` app but are exposed at the root level for convenience:

- `npm run db:generate`: Generates the Prisma client.
- `npm run db:migrate`: Runs database migrations without resetting.
- `npm run db:seed`: Seeds the database with initial data.
- **Factory Reset:** If you want to wipe all data and start completely fresh, you must run it directly from the API folder:
  ```bash
  cd apps/api
  npx prisma migrate reset --force
  ```

## Project Structure

This is a monorepo containing multiple applications and shared packages:

- `apps/`: Contains runnable applications (e.g., API backend).
- `packages/`: Contains shared packages, libraries, and configurations used across the applications.
