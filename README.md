# Marathon App

A React + TypeScript app for tracking marathon training, powered by Strava.

## Quick Start

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start local dev (with API):**

   ```bash
   vercel dev
   ```

   This runs both the frontend and the Strava API locally.

3. **Deploy to production:**
   ```bash
   vercel --prod
   ```

## Strava Setup

- You need Strava API credentials and refresh tokens for each runner.
- Add these as environment variables (see `api/README.md` for details).

## Project Structure

- `src/` — React app (components, hooks, assets)
- `api/` — Serverless Strava API (Vercel function)

## Issues / Board

https://github.com/users/AdrianDanlos/projects/5/views/1

## Code linting / Formatting

Install the recommended VSCode extensions (ESLint and Prettier) under ./vscode/extensions.json to avoid pre-commit errors and ensure consistent code style.
