import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
  rating: number;
};

export class productStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM products;';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable get products: ${err}`);
    }
  }

  async show(id: number): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1);';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`unable show product ${id}: ${err}`);
    }
  }

  async create(product: Product): Promise<Product> {
    const { name, price, category, rating } = product;

    try {
      const sql =
        'INSERT INTO products (name, price, category, rating) VALUES($1, $2, $3, $4) RETURNING *;';
      const connection = await Client.connect();
      const { rows } = await connection.query(sql, [name, price, category, rating]);

      connection.release();

      return rows[0];
    } catch (err) {
      throw new Error(`Could not add new user ${name} ${price}. ${err}`);
    }
  }
  async update(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql =
        'UPDATE products SET name = ($1), price = ($2), category = ($3), rating = ($4) WHERE id = ($5) RETURNING *';

      const result = await conn.query(sql, [p.name, p.price, p.category, p.rating, p.id]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Can't update product => ${error}`);
    }
  }

  async destroy(id: number): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id = ($1) RETURNING *;';
      const conn = await Client.connect();
      const result = await conn.query(sql, [id]);
      const deleteProduct = result.rows[0];
      conn.release();
      return deleteProduct;
    } catch (err) {
      throw new Error(`unable to delete product ${id}: ${err}`);
    }
  }
}
