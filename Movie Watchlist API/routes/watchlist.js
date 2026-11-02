import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { authorizeModification } from "../middleware/authorize.js";
import {
  addMovie,
  deleteMovie,
  getWatchlist,
  updateMovie,
} from "../utils/db.js";

const watchlistRoutes = express.Router();

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

watchlistRoutes.get("/:userId", authenticate, (req, res) => {
  const userId = parseId(req.params.userId);
  if (userId === null) {
    return res.status(400).json({ error: "Invalid user ID." });
  }

  const watchlist = getWatchlist(userId);
  if (watchlist === null) {
    return res.status(404).json({ error: "User not found." });
  }

  return res.status(200).json(watchlist);
});

watchlistRoutes.post("/:userId/movies", authenticate, authorizeModification, (req, res) => {
    const userId = parseId(req.params.userId);
    if (userId === null) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const { title, genre } = req.body ?? {};
    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof genre !== "string" ||
      !genre.trim()
    ) {
      return res.status(400).json({ error: "Title and genre are required." });
    }

    const movie = addMovie(userId, { title: title.trim(), genre: genre.trim() });
    if (movie === null) {
      return res.status(404).json({ error: "User not found." });
    }

    return res.status(201).json({ movie });
  },
);

watchlistRoutes.put("/:userId/movies/:movieId",authenticate, authorizeModification, (req, res) => {
    const userId = parseId(req.params.userId);
    const movieId = parseId(req.params.movieId);
    if (userId === null || movieId === null) {
      return res.status(400).json({ error: "Invalid user or movie ID." });
    }

    const updates = req.body;
    const validUpdates =
      updates &&
      typeof updates === "object" &&
      !Array.isArray(updates) &&
      Object.keys(updates).length > 0 &&
      Object.entries(updates).every(([key, value]) => {
        if (key === "title" || key === "genre") {
          return typeof value === "string" && value.trim().length > 0;
        }
        return key === "watched" && typeof value === "boolean";
      });

    if (!validUpdates) {
      return res.status(400).json({ error: "Invalid movie updates." });
    }

    const movie = updateMovie(userId, movieId, updates);
    if (movie === null) {
      return res.status(404).json({ error: "User or movie not found." });
    }

    return res.status(200).json({ movie });
  },
);

watchlistRoutes.delete("/:userId/movies/:movieId", authenticate, authorizeModification, (req, res) => {
    const userId = parseId(req.params.userId);
    const movieId = parseId(req.params.movieId);
    if (userId === null || movieId === null) {
      return res.status(400).json({ error: "Invalid user or movie ID." });
    }

    const deleted = deleteMovie(userId, movieId);
    if (!deleted) {
      return res.status(404).json({ error: "User or movie not found." });
    }

    return res.status(200).json({ message: "Movie deleted." });
  },
);

export default watchlistRoutes;