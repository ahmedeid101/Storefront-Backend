import Client from '../database';

export type Order = {
  id?: number;
  user_id: number;
  status: string;
};

export class orderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM orders;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get order: ${err}`);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql = 'SELECT * FROM orders WHERE id=($1);';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`unable show order ${id}: ${err}`);
    }
  }

  async create(order: Order): Promise<Order> {
    const { user_id: userId, status } = order;

    try {
      const sql = 'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *;';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [userId, status]);

      connection.release();

      return rows[0];
    } catch (err) {
      throw new Error(`Could not add new order ${status} ${userId}. ${err}`);
    }
  }

  async update(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE orders SET user_id = ($1), status = ($2) WHERE id = ($3) RETURNING *';

      const result = await conn.query(sql, [
        o.user_id,
        o.status,
        o.id
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't update product => ${error}`);
    }
  }

  async destroy(id: number): Promise<Order> {
    try {
      const sql = 'DELETE FROM products WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const deleteOrder = result.rows[0];
      conn.release();
      return deleteOrder;
    } catch (err) {
      throw new Error(`unable to delete product ${id}: ${err}`);
    }
  }
}
