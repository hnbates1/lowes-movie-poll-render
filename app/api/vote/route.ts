import { getDb } from "../../../db";
import { movies, POLL_CLOSES_AT, POLL_ID } from "../../movies";

type PublicVote = {
  movieId: number;
  movieTitle: string;
  submittedAt: string;
};

export async function GET(request: Request) {
  const requestedPoll = new URL(request.url).searchParams.get("pollId");
  if (requestedPoll && requestedPoll !== POLL_ID) {
    return Response.json({ error: "That poll is not available." }, { status: 404 });
  }

  return Response.json({ existingVote: null });
}

export async function POST(request: Request) {
  if (Date.now() >= Date.parse(POLL_CLOSES_AT)) {
    return Response.json(
      {
        error: "Voting has closed. The final results are now available.",
        status: "closed",
      },
      { status: 410 },
    );
  }

  let payload: { pollId?: string; movieId?: number };
  try {
    payload = (await request.json()) as { pollId?: string; movieId?: number };
  } catch {
    return Response.json({ error: "Invalid ballot submission." }, { status: 400 });
  }

  if (payload.pollId !== POLL_ID) {
    return Response.json({ error: "That poll is not available." }, { status: 400 });
  }

  const movie = movies.find((choice) => choice.sortOrder === payload.movieId);
  if (!movie) {
    return Response.json({ error: "Choose one of the available movies." }, { status: 400 });
  }

  const submissionId = crypto.randomUUID();
  const previewVote: PublicVote = {
    movieId: movie.sortOrder,
    movieTitle: movie.title,
    submittedAt: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production") {
    return Response.json({ vote: previewVote }, { status: 201 });
  }

  try {
    const db = await getDb();
    const { rows } = await db.query<{
      movie_id: number;
      movie_title: string;
      submitted_at: Date;
    }>(
      `INSERT INTO movie_votes
        (poll_id, movie_id, imdb_id, movie_title, voter_name, voter_email, vote_key, submitted_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING movie_id, movie_title, submitted_at`,
      [
        POLL_ID,
        movie.sortOrder,
        movie.imdbId,
        movie.title,
        "Anonymous visitor",
        `anonymous-${submissionId}@movie-poll.invalid`,
        `${POLL_ID}|anonymous|${submissionId}`,
      ],
    );
    const saved = rows[0];

    return Response.json(
      {
        vote: {
          movieId: saved.movie_id,
          movieTitle: saved.movie_title,
          submittedAt: saved.submitted_at.toISOString(),
        } satisfies PublicVote,
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      { error: "We couldn’t record your vote. Please try again." },
      { status: 500 },
    );
  }
}
