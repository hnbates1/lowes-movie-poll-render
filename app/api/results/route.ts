import { getDb } from "../../../db";
import { movies, POLL_CLOSES_AT, POLL_ID } from "../../movies";

type VoteTotal = {
  movieId: number;
  votes: number;
};

function buildResults(voteTotals: VoteTotal[]) {
  const counts = new Map(voteTotals.map((item) => [item.movieId, Number(item.votes)]));
  const totalVotes = voteTotals.reduce((sum, item) => sum + Number(item.votes), 0);
  const ranked = movies
    .map((movie) => ({
      movieId: movie.sortOrder,
      title: movie.title,
      year: movie.year,
      rating: movie.rating,
      runtime: movie.runtime,
      poster: movie.poster,
      votes: counts.get(movie.sortOrder) ?? 0,
    }))
    .sort((a, b) => b.votes - a.votes || a.movieId - b.movieId);

  let previousVotes: number | null = null;
  let rank = 0;
  const results = ranked.map((movie, index) => {
    if (movie.votes !== previousVotes) rank = index + 1;
    previousVotes = movie.votes;
    return {
      ...movie,
      rank,
      percentage: totalVotes === 0 ? 0 : Math.round((movie.votes / totalVotes) * 1000) / 10,
    };
  });

  return { totalVotes, results };
}

function json(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const requestedPoll = url.searchParams.get("pollId");
  if (requestedPoll && requestedPoll !== POLL_ID) {
    return json({ error: "That poll is not available." }, 404);
  }

  const previewResults =
    process.env.NODE_ENV !== "production" && url.searchParams.get("preview") === "results";
  const isClosed = previewResults || Date.now() >= Date.parse(POLL_CLOSES_AT);
  const status = isClosed ? "closed" : "open";

  if (process.env.NODE_ENV !== "production") {
    return json({
      status,
      closesAt: POLL_CLOSES_AT,
      ...buildResults(
        previewResults
          ? [
              { movieId: 8, votes: 14 },
              { movieId: 2, votes: 10 },
              { movieId: 5, votes: 8 },
              { movieId: 3, votes: 6 },
              { movieId: 1, votes: 5 },
              { movieId: 4, votes: 4 },
              { movieId: 6, votes: 3 },
              { movieId: 7, votes: 2 },
            ]
          : [],
      ),
    });
  }

  try {
    const db = await getDb();
    const { rows } = await db.query<{ movie_id: number; votes: string }>(
      `SELECT movie_id, COUNT(*)::text AS votes
       FROM movie_votes
       WHERE poll_id = $1
       GROUP BY movie_id`,
      [POLL_ID],
    );
    const voteTotals = rows.map((row) => ({
      movieId: row.movie_id,
      votes: Number(row.votes),
    }));

    return json({
      status,
      closesAt: POLL_CLOSES_AT,
      ...buildResults(voteTotals),
    });
  } catch {
    return json({ error: "The live results are temporarily unavailable." }, 503);
  }
}
