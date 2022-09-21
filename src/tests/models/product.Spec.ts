import { Product, productStore } from '../../models/product';
import Client from '../../database';

const store = new productStore();

export const productList: Product[] = [
  {
    name: 'samsong',
    price: 5000,
    category: 'mobiles',
    rating: 4
  },
  {
    name: 'bag',
    category: 'fashon',
    price: 600,
    rating: 3
  }
];

describe('product model', () => {
  describe('Test Existing Methods', async () => {
    it('exsist index method', () => {
      expect(store.index).toBeDefined();
    });

    it('exsist show method', () => {
      expect(store.show).toBeDefined();
    });

    it('exsist create method', () => {
      expect(store.create).toBeDefined();
    });

    it('exsist update method', () => {
      expect(store.update).toBeDefined();
    });

    it('exsist delet method', () => {
      expect(store.destroy).toBeDefined();
    });
  });

  describe('Test products Methods Logic', () => {
    const product: Product = {
      name: 'bag',
      price: 600,
      category: 'fashon',
      rating: 3
    };

    beforeAll(async () => {
      const createProduct = await store.create(product);
      product.id = createProduct.id;
    });

    afterAll(async () => {
      const conn = await Client.connect();
      const sql = 'DELETE FROM products;';
      await conn.query(sql);
      conn.release();
    });

    it('show should return the product with the given id', async () => {
      const result = await store.show(product.id as unknown as number);

      expect(result).toEqual({
        id: result.id,
        name: result.name,
        price: result.price,
        category: result.category,
        rating: result.rating
      });
    });

    it('create should add a product', async () => {
      const result = await store.create({
        id: product.id,
        name: 'bag',
        price: 600,
        category: 'fashon',
        rating: 3
      });
      expect(result).toEqual({
        id: result.id,
        name: result.name,
        price: result.price,
        category: result.category,
        rating: result.rating
      });
    });

    it('update method should update product', async () => {
      const updatedPrduct: Product = {
        id: product.id,
        name: 'chips',
        price: 5,
        category: 'food',
        rating: 4
      };
      const result = await store.update(updatedPrduct);
      expect(result).toBeDefined();
    });

    it('delete should remove the product with the given id', async () => {
      const deletedProduct = await store.destroy(product.id as unknown as number);
      const products = await store.index();

      expect(products).not.toContain(deletedProduct);
      expect(deletedProduct).toEqual({
        id: deletedProduct.id,
        name: deletedProduct.name,
        price: deletedProduct.price,
        category: deletedProduct.category,
        rating: deletedProduct.rating
      });
    });
  });
});
