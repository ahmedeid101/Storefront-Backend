import Client from '../../database';
import { Product, productStore } from './../../models/product';
import app from '../../index';
import supertest from 'supertest';
import {testToken} from './user.spec'

const store = new productStore();

const request = supertest(app);

describe('Test User Endpoint', () => {
  beforeAll(async () => {
    const product: Product = {
      name: 'bag',
      price: 600,
      category: 'fashon',
      rating: 3
    };
     await store.create(product);
  });


  it('index product method', async () => {
    const response = await request
      .get('/products')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('show product method', async () => {
    const response = await request
      .get('/products/1')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('should return a new user after it is created', () => {
    const data = {
        name: 'Test1',
        price: 40.0,
        category: 'category a',
        rating: 4,
    }
    request
        .post('/products')
        .set('Authorization', `Bearer ${testToken}`)
        .send(data)
        .expect('Content-Type', 'application/json')
        .expect(201)
        .expect({
            id: 1,
            name: 'Test1',
            price: '$40.00',
            category: 'category a',
            rating:4
        })
})

it('should have an update product endpoint', () => {
  const data = {
      name: 'Test2',
      price: 100.0,
  }
  request
      .put('/products/1')
      .set('Authorization', `Bearer ${testToken}`)
      .send(data)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect({
          id: 1,
          name: 'Test2',
          price: 100.0,
          category: 'category a',
      })
})


  it('update product info ', async () => {
    const response = await request
      .put('/products/1')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        id: 2,
        name: 'mobile',
        price: 5000,
        category: 'Electornics',
      });
    expect(response.status).toBe(404);
  });

  it('delete products info ', async () => {
    const response = await request
      .delete('/products/1')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = `TRUNCATE TABLE products CASCADE;`;
    await conn.query(sql);
    await conn.query(`ALTER SEQUENCE products_id_seq RESTART WITH 1;`);
    conn.release();
  });
});
