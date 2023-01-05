const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieTagsController {
  async create(request, response) {
    const {name} = request.body;
    const user_id = request.user.id;
    const {note_id} = request.params;

    const tagExists = await knex("movie_tags").where({name}).andWhere({note_id})

    if (tagExists.length) {
      throw new AppError("Esse tag pra essa nota já existe");
    }

    await knex("movie_tags").insert({
      name,
      user_id,
      note_id,
    })
    return response.json();
  }

  async index(request, response) {
    const {note_id} = request.params;
    const user_id = request.user.id;

    const tags = await knex("movie_tags").where({note_id}).andWhere({user_id});

    return response.json(tags)
  }

  async delete(request, response) {
    const {id} = request.params;
    
    await knex("movie_tags").where({id}).delete();

    return response.json();
  }
}

module.exports = MovieTagsController