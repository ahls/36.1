/** User class for message.ly */

const db = require("../db");
const ExpressError = require("../expressError");
const bcrypt = require('bcrypt')

/** User of the site. */

class User {


  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) 
  { 
    const res = await db.query(`
    INSERT INTO users (username, password, first_name, last_name, phone, join_at)
    VALUES ($1, $2, $3, $4, $5, current_timestamp)
    RETURNING username`
    ,[username, password, first_name, last_name, phone]);
    if(res.rows[0])
      return {username,password,first_name,last_name,phone};
    throw(new ExpressError("Username not found!",404))
  }

  /** Authenticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) 
  {
    const res = await db.query(
      `
      SELECT username FROM users WHERE username = $1
      `,[username]
    );
    return bcrypt.compare(password,res.rows[0].password);
  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) 
  {
    const res = await db.query(`
    UPDATE users SET last_login_at = current_timestamp WHERE username = $1`,[username]);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() {
    const res = await db.query(`
    SELECT username, first_name, last_name, phone 
    FROM users
    `);
    return res.rows;
  }

  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */
  

  static async get(username) { 
    const res = await db.query(`
    SELECT username, first_name, last_name, phone, join_at, last_login_at
    FROM users
    WHERE username = $1
    `, username)
    if(!res.rows[0]) throw(new ExpressError("Username not found!",404))
    return res.rows[0];
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) 
  {
    const res = await db.query(`
    SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at
    FROM users u LEFT JOIN messages m ON u.username = m.from_username
    WHERE u.username = $1
    `,[username]);
    return res.rows;
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username)
  {
    const res = await db.query(`
    SELECT m.id, m.to_username, m.body, m.sent_at, m.read_at
    FROM users u LEFT JOIN messages m ON u.username = m.to_username
    WHERE u.username = $1
    `,[username]);
    return res.rows;
  }
}


module.exports = User;