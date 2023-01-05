const { Router } = require("express");

const MovieTagsController = require("../controllers/MovieTagsController");

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const movieTagsRoutes = Router();

const movieTagsController = new MovieTagsController();

movieTagsRoutes.use(ensureAuthenticated);

movieTagsRoutes.post("/:note_id", movieTagsController.create)
movieTagsRoutes.get("/:note_id", movieTagsController.index)
movieTagsRoutes.delete("/:id", movieTagsController.delete)

module.exports = movieTagsRoutes;