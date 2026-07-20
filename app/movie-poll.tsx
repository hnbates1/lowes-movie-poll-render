"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  movies,
  POLL_CLOSES_AT,
  POLL_CLOSES_LABEL,
  POLL_ID,
  SITE_CLOSES_LABEL,
  type Movie,
} from "./movies";

type Screen = "browse" | "vote" | "results";

type PollResult = {
  movieId: number;
  title: string;
  year: number;
  rating: string;
  runtime: string;
  poster: string;
  votes: number;
  rank: number;
  percentage: number;
};

type PollSnapshot = {
  status: "open" | "closed";
  closesAt: string;
  totalVotes: number;
  results: PollResult[];
};

function BrandMark() {
  return (
    <Image
      className="brand-mark"
      src="/lowes-gable.png"
      alt="Lowe's"
      width={1354}
      height={623}
      priority
    />
  );
}

function Sparkles({ className = "" }: { className?: string }) {
  return (
    <div className={`sparkles ${className}`} aria-hidden="true">
      <i className="spark sparkle-one">✦</i>
      <i className="spark sparkle-two">◆</i>
      <i className="spark sparkle-three">✦</i>
      <i className="spark sparkle-four">◇</i>
    </div>
  );
}

function LayeredTitle({ top, bottom }: { top: string; bottom: string }) {
  return (
    <h1 className="layered-title" aria-label={`${top} ${bottom}`}>
      <span data-text={top}>{top}</span>
      <span data-text={bottom}>{bottom}</span>
    </h1>
  );
}

function MovieCard({
  movie,
  flipped,
  onFlip,
}: {
  movie: Movie;
  flipped: boolean;
  onFlip: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onFlip();
    }
  };

  return (
    <article className="movie-card-wrap" aria-label={`${movie.title} movie card`}>
      <div className={`movie-card ${flipped ? "is-flipped" : ""}`}>
        <div
          className="card-face card-front"
          role="button"
          tabIndex={flipped ? -1 : 0}
          aria-label={`View details for ${movie.title}`}
          aria-hidden={flipped}
          onClick={onFlip}
          onKeyDown={handleKeyDown}
        >
          <div className="poster-frame">
            <img src={movie.poster} alt={`${movie.title} movie poster`} />
            <span className="rating-sticker">{movie.rating}</span>
          </div>
          <div className="front-copy">
            <h2>{movie.title}</h2>
            <p>
              {movie.year} <b>•</b> {movie.rating} <b>•</b> {movie.runtime}
            </p>
            <span className="tap-pill">Tap for details <b>↗</b></span>
          </div>
        </div>

        <div
          className="card-face card-back"
          role="button"
          tabIndex={flipped ? 0 : -1}
          aria-label={`Return to poster for ${movie.title}`}
          aria-hidden={!flipped}
          onClick={onFlip}
          onKeyDown={handleKeyDown}
        >
          <div className="back-scroll">
            <span className="detail-count">{String(movie.sortOrder).padStart(2, "0")} / 08</span>
            <h2>{movie.title}</h2>
            <p className="meta-pill">
              {movie.year} • {movie.rating} • {movie.runtime}
            </p>
            <p className="synopsis">{movie.synopsis}</p>
            <div className="content-notes">
              <h3><span aria-hidden="true">●</span> Content</h3>
              <p>{movie.contentNotes}</p>
            </div>
            <a
              className="imdb-link"
              href={`https://www.imdb.com/title/${movie.imdbId}/`}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
            >
              View on IMDb <span aria-hidden="true">↗</span>
            </a>
          </div>
          <span className="tap-return">↶ Tap to return</span>
        </div>
      </div>
    </article>
  );
}

function BrowseScreen({
  onVote,
  onViewResults,
}: {
  onVote: () => void;
  onViewResults: () => void;
}) {
  const [flippedMovieId, setFlippedMovieId] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  const updateActiveCard = useCallback(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const cards = Array.from(
      carousel.querySelectorAll<HTMLElement>(".movie-card-wrap"),
    );
    const carouselLeft = carousel.getBoundingClientRect().left;
    let closest = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    cards.forEach((card, index) => {
      const distance = Math.abs(card.getBoundingClientRect().left - carouselLeft);
      if (distance < closestDistance) {
        closest = index;
        closestDistance = distance;
      }
    });
    setActiveIndex(closest);
  }, []);

  const onScroll = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(updateActiveCard);
  };

  const moveCarousel = (direction: -1 | 1) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const target = Math.max(0, Math.min(movies.length - 1, activeIndex + direction));
    carousel.querySelectorAll<HTMLElement>(".movie-card-wrap")[target]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "start",
    });
  };

  return (
    <main className="screen browse-screen">
      <header className="hero browse-hero">
        <div className="brand-row">
          <BrandMark />
          <span className="store-pill">Store #244</span>
        </div>
        <div className="hero-copy">
          <div>
            <p className="eyebrow">Associate Movie Poll • 2026</p>
            <LayeredTitle top="MOVIE" bottom="+ POPCORN DAY" />
            <p className="hero-subtitle">
              Swipe through the choices, tap a card for details, then cast your vote.
            </p>
            <p className="poll-deadline">
              <span aria-hidden="true">●</span> Voting closes {POLL_CLOSES_LABEL}
            </p>
          </div>
          <div className="popcorn-badge" aria-hidden="true">
            <span>POP</span>
            <b>CORN!</b>
          </div>
        </div>
        <Sparkles className="hero-sparkles" />
      </header>

      <section className="carousel-section" aria-labelledby="movie-choices-heading">
        <div className="section-heading-row">
          <div>
            <p className="swipe-pill">↔ Swipe to explore</p>
            <h2 id="movie-choices-heading">Eight movies. One pick.</h2>
          </div>
          <div className="carousel-tools">
            <span aria-live="polite">
              {String(activeIndex + 1).padStart(2, "0")} <i>/</i> 08
            </span>
            <button
              type="button"
              onClick={() => moveCarousel(-1)}
              disabled={activeIndex === 0}
              aria-label="Previous movie"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveCarousel(1)}
              disabled={activeIndex === movies.length - 1}
              aria-label="Next movie"
            >
              →
            </button>
          </div>
        </div>

        <div
          className="movie-carousel"
          ref={carouselRef}
          onScroll={onScroll}
          aria-label="Movie choices"
        >
          {movies.map((movie) => (
            <MovieCard
              movie={movie}
              key={movie.sortOrder}
              flipped={flippedMovieId === movie.sortOrder}
              onFlip={() =>
                setFlippedMovieId((current) =>
                  current === movie.sortOrder ? null : movie.sortOrder,
                )
              }
            />
          ))}
        </div>
      </section>

      <footer className="sticky-action browse-action">
        <div>
          <span className="mini-diamond" aria-hidden="true">◆</span>
          <p><b>Seen enough?</b> Your ballot is one tap away.</p>
        </div>
        <nav className="browse-action-buttons" aria-label="Poll actions">
          <button className="secondary-button" type="button" onClick={onViewResults}>
            View live results <span aria-hidden="true">↗</span>
          </button>
          <button className="primary-button" type="button" onClick={onVote}>
            Cast your vote <span aria-hidden="true">→</span>
          </button>
        </nav>
      </footer>
    </main>
  );
}

function VoteScreen({
  onBack,
  onSubmitted,
  onClosed,
}: {
  onBack: () => void;
  onSubmitted: (movie: Movie) => void;
  onClosed: () => void;
}) {
  const [selected, setSelected] = useState<Movie | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitVote() {
    if (!selected || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ pollId: POLL_ID, movieId: selected.sortOrder }),
      });
      const data = (await response.json()) as {
        error?: string;
        status?: string;
      };
      if (data.status === "closed") {
        onClosed();
      }
      if (!response.ok) throw new Error(data.error || "We couldn’t record your vote.");
      onSubmitted(selected);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "We couldn’t record your vote.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="screen vote-screen">
      <header className="compact-header">
        <div className="brand-row">
          <BrandMark />
          <span className="store-pill">Store #244</span>
        </div>
        <button className="back-button" type="button" onClick={onBack}>
          ← Back to movies
        </button>
        <p className="eyebrow">Official ballot</p>
        <LayeredTitle top="MAKE" bottom="YOUR PICK" />
        <p className="hero-subtitle">Choose one movie, then submit your vote.</p>
        <Sparkles />
      </header>

      <section className="ballot-section" aria-labelledby="ballot-heading">
        <div className="ballot-intro">
          <div>
            <span className="step-pill">Step 1 of 1</span>
            <h2 id="ballot-heading">Select one movie</h2>
          </div>
          <p>
            <strong>Anonymous ballot</strong> • no sign-in required
          </p>
        </div>

        {error && (
          <div className="status-banner error-banner" role="alert">
            <span aria-hidden="true">!</span>
            <div>
              <strong>We hit a snag.</strong>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="ballot-grid" role="radiogroup" aria-label="Choose a movie">
          {movies.map((movie) => {
            const isSelected = selected?.sortOrder === movie.sortOrder;
            return (
              <button
                type="button"
                className={`ballot-card ${isSelected ? "selected" : ""}`}
                key={movie.sortOrder}
                onClick={() => setSelected(movie)}
                role="radio"
                aria-checked={isSelected}
              >
                <span className="ballot-number">{String(movie.sortOrder).padStart(2, "0")}</span>
                <img src={movie.poster} alt="" />
                <span className="ballot-copy">
                  {isSelected && <b className="your-pick">Your pick</b>}
                  <strong>{movie.title}</strong>
                  <small>{movie.year} • {movie.rating} • {movie.runtime}</small>
                </span>
                <span className="radio-indicator" aria-hidden="true">
                  {isSelected ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <footer className="sticky-action vote-action">
        <div className="selection-summary">
          {selected ? (
            <>
              <img src={selected.poster} alt="" />
              <p><span>Your selection</span><b>{selected.title}</b></p>
            </>
          ) : (
            <p><span>Your selection</span><b>Choose a movie above</b></p>
          )}
        </div>
        <button
          className="primary-button"
          type="button"
          onClick={submitVote}
          disabled={!selected || submitting}
        >
          {submitting ? "Recording…" : "Submit my vote"}
          <span aria-hidden="true">→</span>
        </button>
      </footer>
    </main>
  );
}

function ResultsScreen({
  snapshot,
  submittedMovie,
}: {
  snapshot: PollSnapshot;
  submittedMovie?: Movie | null;
}) {
  const isFinal = snapshot.status === "closed";
  const topVotes = snapshot.results[0]?.votes ?? 0;
  const winners = topVotes > 0
    ? snapshot.results.filter((result) => result.votes === topVotes)
    : [];
  const winnerTitle = winners.map((winner) => winner.title).join(" & ");
  const posterResults = [...snapshot.results].sort((a, b) => a.movieId - b.movieId);

  return (
    <main className="screen results-screen">
      <header className="results-header">
        <div className="brand-row">
          <BrandMark />
          <span className="store-pill">Store #244</span>
        </div>
        <div className="results-hero">
          <div>
            <p className="eyebrow">
              {isFinal ? "Final results" : "Live results"} • Movie &amp; Popcorn Day
            </p>
            <LayeredTitle
              top={isFinal ? "THE VOTES" : "LIVE POLL"}
              bottom={isFinal ? "ARE IN!" : "RESULTS"}
            />
            <p className="hero-subtitle">
              {isFinal
                ? "Thanks to everyone who voted. The ballot is now closed."
                : "Watch the posters come alive as each movie collects votes."}
            </p>
          </div>
          <div className="results-total" aria-label={`${snapshot.totalVotes} total ballots`}>
            <strong>{snapshot.totalVotes}</strong>
            <span>Total ballots</span>
          </div>
        </div>
        <Sparkles className="results-sparkles" />
      </header>

      <section className="results-content" aria-labelledby="live-standings-heading">
        {submittedMovie && !isFinal && (
          <div className="vote-recorded-banner" role="status">
            <span aria-hidden="true">✓</span>
            <div>
              <strong>Your vote is recorded!</strong>
              <p>Your pick: {submittedMovie.title} — here’s how the live poll looks now.</p>
            </div>
          </div>
        )}

        <div className="ranking-heading">
          <div>
            <span className="step-pill">{isFinal ? "Final count" : "Updating live"}</span>
            <h2 id="live-standings-heading">All eight in the running</h2>
          </div>
          <p>Color rises relative to the current leader.</p>
        </div>

        <div className="poster-results-scroll">
          <div className="poster-results-row" role="list" aria-label="Live movie standings">
            {posterResults.map((result) => {
              const fillHeight = topVotes === 0 ? 0 : Math.round((result.votes / topVotes) * 1000) / 10;
              const isLeader = result.rank === 1 && result.votes > 0;
              return (
                <article
                  key={result.movieId}
                  className={`poster-result ${isLeader ? "is-leader" : ""}`}
                  role="listitem"
                >
                  <div
                    className="poster-meter"
                    style={{ "--fill": `${fillHeight}%` } as React.CSSProperties}
                    role="img"
                    aria-label={`${result.title}: ${result.votes} votes, ${result.percentage} percent of ballots`}
                  >
                    <img className="poster-mono" src={result.poster} alt="" />
                    <img className="poster-color" src={result.poster} alt="" />
                    {result.votes > 0 && <span className="color-waterline" aria-hidden="true" />}
                    <span className="poster-rank">
                      {result.votes > 0 ? `#${result.rank}` : "—"}
                    </span>
                    {isLeader && <span className="leader-star" aria-hidden="true">★</span>}
                  </div>
                  <div className="poster-result-copy">
                    <strong>{result.title}</strong>
                    <p>
                      <b>{result.votes}</b> {result.votes === 1 ? "vote" : "votes"}
                      <span>{result.percentage}%</span>
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className={`leader-strip ${topVotes === 0 ? "no-votes" : ""}`}>
          <span aria-hidden="true">{topVotes === 0 ? "◇" : "★"}</span>
          <div>
            <strong>
              {topVotes === 0
                ? "Waiting for the first vote"
                : `${winners.length > 1 ? "Current leaders" : "Current leader"}: ${winnerTitle}`}
            </strong>
            <p>
              {topVotes === 0
                ? "The posters will fill with color as votes arrive."
                : `${topVotes} ${topVotes === 1 ? "vote" : "votes"} at the top of the board.`}
            </p>
          </div>
          {!isFinal && <span className="live-pulse">Live</span>}
        </div>

        <p className="results-expiry">
          {isFinal
            ? `Results are final. This page will close ${SITE_CLOSES_LABEL}.`
            : `Live count refreshes automatically. Voting closes ${POLL_CLOSES_LABEL}.`}
        </p>
      </section>
    </main>
  );
}

function ResultsLoading({ error, onRetry }: { error: string | null; onRetry: () => void }) {
  return (
    <main className="screen results-screen">
      <header className="results-header">
        <div className="brand-row">
          <BrandMark />
          <span className="store-pill">Store #244</span>
        </div>
      </header>
      <section className="results-content results-loading" aria-live="polite">
        <p className="eyebrow">Live poll results</p>
        <LayeredTitle top="COUNTING" bottom="THE VOTES" />
        <p className="hero-subtitle">
          {error || "We’re loading the latest vote count now."}
        </p>
        {error && (
          <button className="primary-button" type="button" onClick={onRetry}>
            Try again <span aria-hidden="true">→</span>
          </button>
        )}
      </section>
    </main>
  );
}

export default function MoviePoll() {
  const [screen, setScreen] = useState<Screen>("browse");
  const [submittedMovie, setSubmittedMovie] = useState<Movie | null>(null);
  const [snapshot, setSnapshot] = useState<PollSnapshot | null>(null);
  const [deadlineReached, setDeadlineReached] = useState(false);
  const [resultsError, setResultsError] = useState<string | null>(null);

  const loadPollStatus = useCallback(async () => {
    try {
      const previewResults = new URLSearchParams(window.location.search).get("preview") === "results";
      const response = await fetch(
        `/api/results?pollId=${encodeURIComponent(POLL_ID)}${previewResults ? "&preview=results" : ""}`,
        { cache: "no-store" },
      );
      const data = (await response.json()) as PollSnapshot & { error?: string };
      if (!response.ok) throw new Error(data.error || "We couldn’t load the final results.");
      setSnapshot(data);
      setResultsError(null);
      if (data.status === "closed") setDeadlineReached(true);
    } catch (caught) {
      setResultsError(caught instanceof Error ? caught.message : "We couldn’t load the final results.");
    }
  }, []);

  useEffect(() => {
    const closeTime = Date.parse(POLL_CLOSES_AT);
    const checkStatus = () => {
      if (Date.now() >= closeTime) setDeadlineReached(true);
      void loadPollStatus();
    };

    checkStatus();
    const untilClose = Math.max(0, closeTime - Date.now() + 250);
    const closeTimer = window.setTimeout(checkStatus, Math.min(untilClose, 2_147_000_000));
    const refreshTimer = window.setInterval(checkStatus, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") checkStatus();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearTimeout(closeTimer);
      window.clearInterval(refreshTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [loadPollStatus]);

  useEffect(() => {
    const openResults = window.setTimeout(() => {
      if (new URLSearchParams(window.location.search).get("results") === "live") {
        setScreen("results");
      }
    }, 0);
    return () => window.clearTimeout(openResults);
  }, []);

  useEffect(() => {
    if (screen !== "results") return;
    const firstRefresh = window.setTimeout(() => void loadPollStatus(), 0);
    const liveRefresh = window.setInterval(() => void loadPollStatus(), 5_000);
    return () => {
      window.clearTimeout(firstRefresh);
      window.clearInterval(liveRefresh);
    };
  }, [loadPollStatus, screen]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [screen]);

  if (snapshot?.status === "closed") {
    return <ResultsScreen snapshot={snapshot} submittedMovie={submittedMovie} />;
  }

  if (deadlineReached) {
    return <ResultsLoading error={resultsError} onRetry={() => void loadPollStatus()} />;
  }

  if (screen === "results") {
    return snapshot ? (
      <ResultsScreen snapshot={snapshot} submittedMovie={submittedMovie} />
    ) : (
      <ResultsLoading error={resultsError} onRetry={() => void loadPollStatus()} />
    );
  }

  if (screen === "vote") {
    return (
      <VoteScreen
        onBack={() => setScreen("browse")}
        onSubmitted={(movie) => {
          setSubmittedMovie(movie);
          const nextUrl = new URL(window.location.href);
          nextUrl.searchParams.set("results", "live");
          window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
          setScreen("results");
          void loadPollStatus();
        }}
        onClosed={() => {
          setDeadlineReached(true);
          void loadPollStatus();
        }}
      />
    );
  }

  return (
    <BrowseScreen
      onVote={() => setScreen("vote")}
      onViewResults={() => {
        const nextUrl = new URL(window.location.href);
        nextUrl.searchParams.set("results", "live");
        window.history.replaceState({}, "", `${nextUrl.pathname}${nextUrl.search}`);
        setScreen("results");
        void loadPollStatus();
      }}
    />
  );
}
