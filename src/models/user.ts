import Client from '../database';
import config from '../config';
import bcrypt from 'bcrypt';
import { hashPassword } from '../utilities/encryption';
import {checkPassword} from '../utilities/encryption'


export type User = {
  id?: number;
  first_name: string;
  last_name: string;
  username: string;
  password: string;
};

// export const columnNamesToUserProps = (
//   id: number,
//   first_name: string,
//   last_name: string,
//   username: string,
//   password: string
// ): User => {
//   const user: User = {
//     id: id,
//     first_name: first_name,
//     last_name: last_name,
//     username: username,
//     password: password
//   };
//   return user;
// };


export class userStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable return users: ${err}`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = 'SELECT * FROM users WHERE id=($1);';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const user = result.rows[0];
      conn.release();
      return user;
    } catch (err) {
      throw new Error(`unable show user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'INSERT INTO users (first_name, last_name, username, password) VALUES ($1, $2, $3, $4) RETURNING *;';

      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hashPassword(u.password)
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't create users => ${error}`);
    }
  }

  async update(u: User): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE users SET first_name=$1, last_name=$2, username=$3, password=$4 WHERE id=$5 RETURNING *;';
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.username,
        hashPassword(u.password),
        u.id
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't update users => ${error}`);
    }
  }

  async destroy(id: number): Promise<User> {
    try {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users WHERE id=($1) RETURNING *;';
      const result = await conn.query(sql, [id]);
      const deletUser = result.rows[0];
      conn.release();
      return deletUser;
    } catch (err) {
      throw new Error(`unable delete user (${id}): ${err}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try{
        const conn = await Client.connect();
        const sql = 'SELECT password FROM users WHERE username=$3;';
        const result = await conn.query(sql, [username]);

        if(result.rows.length) {

          const {password:hashPasword} = result.rows[0];
          const isValidPass = bcrypt.compareSync(
            `${password} ${config.pepper}`, hashPasword);
          
          if (isValidPass) {
            const userInfo = await conn.query('SELECT id, first_name, last_name, username FROM users WHERE username=($3);'
            , [username]);
            return userInfo.rows[0];
          }
        }
        conn.release();
        return null
      }catch(err){
        throw new Error(`access denied ${(err as Error).message}`);
      }

  }
}
