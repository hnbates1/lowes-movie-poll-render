import { Pool, type PoolClient } from "pg";
import { movies, POLL_ID } from "../app/movies";

declare global {
  var moviePollPool: Pool | undefined;
}

function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required for database-backed requests.");
  }

  global.moviePollPool ??= new Pool({
    connectionString,
    max: 10,
  });
  return global.moviePollPool;
}

let schemaPromise: Promise<void> | null = null;

type LegacyResult = {
  movieId: number;
  votes: number;
};

async function readLegacyResults(): Promise<LegacyResult[]> {
  const url = process.env.LEGACY_RESULTS_URL;
  if (!url) return [];

  try {
    const response = await fetch(url, {
      cache: "no-store",
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) return [];

    const payload = (await response.json()) as { results?: LegacyResult[] };
    return Array.isArray(payload.results) ? payload.results : [];
  } catch {
    return [];
  }
}

async function importLegacyResults(client: PoolClient, results: LegacyResult[]) {
  const { rows } = await client.query<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM movie_votes WHERE poll_id = $1",
    [POLL_ID],
  );
  if (Number(rows[0]?.count ?? 0) > 0) return;

  for (const result of results) {
    const movie = movies.find((choice) => choice.sortOrder === result.movieId);
    const votes = Math.max(0, Math.floor(Number(result.votes) || 0));
    if (!movie || votes === 0) continue;

    for (let index = 0; index < votes; index += 1) {
      const submissionId = crypto.randomUUID();
      await client.query(
        `INSERT INTO movie_votes
          (poll_id, movie_id, imdb_id, movie_title, voter_name, voter_email, vote_key, submitted_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
        [
          POLL_ID,
          movie.sortOrder,
          movie.imdbId,
          movie.title,
          "Imported anonymous vote",
          `imported-${submissionId}@movie-poll.invalid`,
          `${POLL_ID}|imported|${submissionId}`,
        ],
      );
    }
  }
}

async function ensureSchema() {
  const legacyResults = await readLegacyResults();
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("SELECT pg_advisory_xact_lock(hashtext($1))", [POLL_ID]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS movie_votes (
        id BIGSERIAL PRIMARY KEY,
        poll_id TEXT NOT NULL,
        movie_id INTEGER NOT NULL,
        imdb_id TEXT NOT NULL,
        movie_title TEXT NOT NULL,
        voter_name TEXT NOT NULL,
        voter_email TEXT NOT NULL,
        vote_key TEXT NOT NULL UNIQUE,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    await client.query(
      "CREATE INDEX IF NOT EXISTS movie_votes_poll_id_idx ON movie_votes (poll_id)",
    );
    await importLegacyResults(client, legacyResults);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getDb() {
  const pool = getPool();
  schemaPromise ??= ensureSchema();
  await schemaPromise;
  return pool;
}
