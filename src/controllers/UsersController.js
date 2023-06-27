const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")

const knex = require("../database/knex");

class UsersController {
  async create(request, response) {
    const { name, password, email} = request.body;
    const checkUserExists = await knex("users").where({email})
    if (checkUserExists.length > 0){
      if (checkUserExists[0].email === email){
        throw new AppError("Este E-mail já está em uso.")
      }
    }

    const hashedPassword = await hash(password, 8);

    await knex("users").insert({
      name,
      email,
      password: hashedPassword,
    })
    return response.status(201).json();
  }

  async update(request, response) {
    const {name, password, email,  old_password} = request.body;
    const user_id = request.user.id

    const user = await knex("users").where({id: user_id}).first();

    if (!user){
      throw new AppError("Usuário não encontrado");
    }

    const userWithUpdatedEmail = await knex("users").where({email}).first()

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
      throw new AppError("Este email já está em uso.")
    }
    user.name = name ?? user.name;
    user.email = email ?? user.email;

    if (password && !old_password) {
      throw new AppError("Para alterar a senha você precisa informar a senha antiga");
    }
    if (password && old_password){
      const isOldPasswordMatched = await compare(old_password, user.password)
      if (!isOldPasswordMatched){
        throw new AppError("A senha antiga está incorreta")
      }
      user.password = await hash(password, 8);
    }

    await knex("users").where({id: user_id}).update({
      name: user.name,
      email: user.email,
      password: user.password,
      updated_at: knex.fn.now()
    })
    return response.json()
  }
}

module.exports = UsersController;