const knex = require("../database/knex");
const AppError = require("../utils/AppError");

class MovieNotesController {
  async create(request, response) {
    const { title, description, rating} = request.body;
    const user_id = request.user.id;
    const noteExists = await knex("movie_notes").where({title})

    if (noteExists.length){
      throw new AppError("Esse Título já existe")
    }

    await knex("movie_notes").insert({
      title,
      description,
      rating,
      user_id
    })
    return response.json();
  }
  
  async update(request, response) {
    const {title, description, rating} = request.body;
    const {id} = request.params

    const note = await knex("movie_notes").where({id}).first();
    if (!note) {
      throw new AppError("Erro :(  Nota não encontrada");
    }

    const noteSearchedWithTitle = await knex("movie_notes").where({title}).first();
    if (noteSearchedWithTitle.id !== note.id ) {
      throw new AppError("Esse título já existe")
    }

    note.title = title ?? note.title;
    note.description = description ?? note.description;
    note.rating = rating ?? note.rating;

    await knex("movie_notes").where({id}).update({
      title: note.title,
      description: note.description,
      rating: note.description,
    })
    return response.json()
  }

  async index(request, response) {
    const user_id = request.user.id;
    const notes = await knex("movie_notes").where({user_id}).orderBy("created_at")

    return response.json({notes})
  }

  async show(request, response) {
    const {id} = request.params;
    const note = await knex("movie_notes").where({id}).first();

    return response.json({note})
  }

  async delete(request, response) {
    const {id} = request.params;
    const note = await knex("movie_notes").where({id}).delete();

    return response.json();
  }
}

module.exports = MovieNotesController;