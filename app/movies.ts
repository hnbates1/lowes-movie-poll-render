export type Movie = {
  sortOrder: number;
  title: string;
  year: number;
  rating: string;
  runtime: string;
  imdbId: string;
  synopsis: string;
  contentNotes: string;
  poster: string;
  accent: string;
};

export const POLL_ID = "STORE0244_MOVIE_POPCORN_2026";
export const POLL_CLOSES_AT = "2026-07-21T03:59:00.000Z";
export const SITE_CLOSES_AT = "2026-07-22T03:59:00.000Z";
export const POLL_CLOSES_LABEL = "Monday, July 20 at 11:59 PM ET";
export const SITE_CLOSES_LABEL = "Tuesday, July 21 at 11:59 PM ET";

export const movies: Movie[] = [
  {
    sortOrder: 1,
    title: "The Devil Wears Prada",
    year: 2006,
    rating: "PG-13",
    runtime: "1 hr 49 min",
    imdbId: "tt0458352",
    synopsis:
      "Recent college graduate Andy lands a job assisting Miranda Priestly, the brilliant but terrifying editor of a prestigious fashion magazine. As Andy becomes increasingly absorbed in Miranda’s world, her career ambitions begin affecting her relationships and identity.",
    contentNotes:
      "Mild language, drinking, romance and implied sex. No nudity, gore or significant violence.",
    poster: "/posters/devil_wears_prada.jpg",
    accent: "#da291c",
  },
  {
    sortOrder: 2,
    title: "The Intern",
    year: 2015,
    rating: "PG-13",
    runtime: "2 hr 1 min",
    imdbId: "tt2361509",
    synopsis:
      "A retired 70-year-old widower joins a senior-internship program at a rapidly growing online clothing company. He gradually becomes a trusted friend and adviser to the company’s overwhelmed founder.",
    contentNotes:
      "Sexual jokes, drinking, mild language and an infidelity subplot. Nothing graphic and no violence or gore.",
    poster: "/posters/the_intern.jpg",
    accent: "#9bcbeb",
  },
  {
    sortOrder: 3,
    title: "Unstoppable",
    year: 2010,
    rating: "PG-13",
    runtime: "1 hr 38 min",
    imdbId: "tt0477080",
    synopsis:
      "A veteran railroad engineer and a young conductor must stop an unmanned freight train carrying toxic chemicals before it reaches a heavily populated area. It’s a fast, tense action thriller inspired by a real incident.",
    contentNotes:
      "Constant peril, train crashes, mild language and a few non-graphic injuries. No sex, nudity or gore.",
    poster: "/posters/unstoppable.jpg",
    accent: "#da291c",
  },
  {
    sortOrder: 4,
    title: "Jumanji: The Next Level",
    year: 2019,
    rating: "PG-13",
    runtime: "2 hr 3 min",
    imdbId: "tt7975244",
    synopsis:
      "A group of friends returns to the dangerous Jumanji video game to rescue one of their own, but the game has changed—and two confused older relatives have accidentally joined the adventure.",
    contentNotes:
      "Fantasy action, slapstick violence, suggestive jokes and mild language. No gore or explicit sexual content. It’s understandable without the previous movie, although seeing it helps.",
    poster: "/posters/jumanji_next_level.jpg",
    accent: "#00a3e0",
  },
  {
    sortOrder: 5,
    title: "Dodgeball: A True Underdog Story",
    year: 2004,
    rating: "PG-13",
    runtime: "1 hr 32 min",
    imdbId: "tt0364725",
    synopsis:
      "The eccentric members of a struggling neighborhood gym enter a professional dodgeball tournament to save their business from an obnoxious corporate fitness competitor.",
    contentNotes:
      "Frequent sexual jokes, crude humor, mild language and exaggerated slapstick injuries. Nothing graphic and no gore.",
    poster: "/posters/dodgeball.jpg",
    accent: "#da291c",
  },
  {
    sortOrder: 6,
    title: "Grown Ups",
    year: 2010,
    rating: "PG-13",
    runtime: "1 hr 42 min",
    imdbId: "tt1375670",
    synopsis:
      "Five childhood friends reunite with their families after their former basketball coach dies. Their weekend together becomes a relaxed series of competitions, embarrassing stories and jokes about marriage, parenting and getting older.",
    contentNotes:
      "Crude jokes, sexual innuendo, drinking and mild language. No gore or graphic sexual content.",
    poster: "/posters/grown_ups.jpg",
    accent: "#9bcbeb",
  },
  {
    sortOrder: 7,
    title: "Interstellar",
    year: 2014,
    rating: "PG-13",
    runtime: "2 hr 49 min",
    imdbId: "tt0816692",
    synopsis:
      "As Earth becomes increasingly unable to support humanity, a former pilot joins a mission through a mysterious wormhole to search for a habitable planet. The science-fiction adventure is built around the emotional relationship between a father and daughter.",
    contentNotes:
      "Intense peril, death, emotional scenes and occasional language. No sex, nudity or gore. Excellent, but it runs approximately 2 hours 49 minutes and requires attention.",
    poster: "/posters/interstellar.jpg",
    accent: "#00a3e0",
  },
  {
    sortOrder: 8,
    title: "Mamma Mia!",
    year: 2008,
    rating: "PG-13",
    runtime: "1 hr 48 min",
    imdbId: "tt0795421",
    synopsis:
      "A young woman preparing for her wedding secretly invites three men—each of whom could be her father—to her mother’s Greek island hotel. The story unfolds through ABBA songs, romance and escalating confusion.",
    contentNotes:
      "Romantic and sexual references, drinking and mild language. No nudity, violence or gore.",
    poster: "/posters/mamma_mia.jpg",
    accent: "#9bcbeb",
  },
];
