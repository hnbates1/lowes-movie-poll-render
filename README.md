# Lowe's Movie & Popcorn Poll

A public anonymous movie poll for Lowe's Store #244, built with Next.js and PostgreSQL.

## Schedule

- Ballots close Monday, July 20, 2026 at 11:59 PM Eastern.
- Final results remain public until Tuesday, July 21, 2026 at 11:59 PM Eastern.
- At the Tuesday deadline every route returns `410 Gone`, so the entire site disappears.

## Deploy to Render

This repository includes a Render Blueprint that creates both the web service and its PostgreSQL database.

1. In Render, choose **New > Blueprint**.
2. Connect this GitHub repository.
3. Keep the Blueprint path as `render.yaml` and deploy it.
4. Open the generated `onrender.com` URL and submit a test vote.

On its first database connection, the Render version imports the current public vote totals from the original Sites deployment. Later votes are stored in Render Postgres.

## Local development

Use Node.js 22 and a PostgreSQL database:

```bash
cp .env.example .env.local
npm install
npm run dev
```

The app creates the `movie_votes` table and index automatically.
