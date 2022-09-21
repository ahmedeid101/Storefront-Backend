import Client from '../../database';
import app from '../../index';
import supertest from 'supertest';
import {testToken} from './user.spec'


const request = supertest(app);

describe('Test Order Endpoint', () => {
  
  
  it('create should return a new order ', () => {
    const data = {
        user_id: 1,
        status: 'coplete',
    }
    request
        .post('/orders')
        .set('Authorization', `Bearer ${testToken}`)
        .send(data)
        .expect('Content-Type', 'application/json')
        .expect(201)
        .expect({
            id: 1,
            user_id: 1,
            status: ' complete',
        })
});

  it('index order method', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('show order method', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(500);
  });

it('orders should update an order', () => {
  const data = {
      id: 1,
      user_id: 1,
      status: 'active',
  }
  request
      .put('/orders/1')
      .set('Authorization', `Bearer ${testToken}`)
      .send(data)
      .expect('Content-Type', 'application/json')
      .expect(200)
      .expect({
          id: 1,
          user_id: 1,
          status: 'active',
      })
})

  it('delete should delete orders ', () => {
    request
        .get('/orders/1')
        .set('Authorization', `Bearer ${testToken}`)
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect({
            id: 1,
            user_id: 1,
            status: 'active',
        })
      });

  
  afterAll(async () => {
    const conn = await Client.connect();
    await conn.query(`TRUNCATE TABLE orders CASCADE;`);
    await conn.query(`TRUNCATE TABLE users CASCADE;`);
    await conn.query(`ALTER SEQUENCE users_id_seq RESTART WITH 1;`);

    conn.release();
  });
});
