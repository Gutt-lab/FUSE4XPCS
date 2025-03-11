const UserRepository = require('../../domain/ports/user.repos');
const User = require('../../domain/entities/user');
const db_connection = require('../db/mysql-connection');
const { json } = require('express');
const { use } = require('../http/routes/user-auth.router');
//const { v4: uuidv4 } = require('uuid');

class MySQLUserRepository extends UserRepository {
  async save(userData) {
    // const id = uuidv4();
    // const [result] = await db.execute(
    //   'INSERT INTO users (id, email, password, name) VALUES (?, ?, ?, ?)',
    //   [id, userData.email, userData.password, userData.name]
    // );

    // return new User(id, userData.email, userData.password, userData.name);
  }


  async get(login_name){
    var query = 'SELECT * FROM users WHERE login_name = ?'
    var values = [login_name]
    const [rows, fields] = await db_connection.pool.promise().query(query, values);
    return rows[0];
  }


    async findByLoginName(login_name) {
    const z = await this.get(login_name).then(user=>{
      return new User(user.user_id, user.user_pwd, user.login_name, user.first_name, user.last_name);
    })
    return z
  }

  async findById(id) {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return null;
    }

    const user = rows[0];
    return new User(user.id, user.email, user.password, user.name, user.first_name, user.last_name);
  }
}

module.exports = MySQLUserRepository;