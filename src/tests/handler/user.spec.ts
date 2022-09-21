import Client from '../../database';
import app from '../../index';
import supertest from 'supertest';
import {createAuthToken} from '../../utilities/encryption'

const request = supertest(app);

export const testToken = createAuthToken('test');


describe('Test User Endpoint', () => {

  it('create should return a user', () => {
    const data = {
        first_name: 'ahmed',
        last_name: 'eid',
        username: 'admin101',
        password: 'root101',
    }
    request
        .post('/users')
        .send(data)
        .expect('Content-Type', 'application/json')
        .expect(201)
        .expect({
            id: 1,
            first_name: 'ahmed',
            last_name: 'eid',
            username: 'admin101',
        });
});


  it('get all users method', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('get user method', async () => {
    const response = await request
      .get('/users/1')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('/users/:id should update a user', () => {
    const data = {
        first_name: 'aly',
        last_name: 'fared',
        username: 'admin103',
        password: 'root103',
    }
    request
        .put('/users/1')
        .set('Authorization', `Bearer ${testToken}`)
        .send(data)
        .expect('Content-Type', 'application/json')
        .expect(200)
        .expect({
            id: 1,
            first_name: 'aly',
            last_name: 'fared',
            username: 'admin103',
            password: 'root103',
        })
});

  it('update user data ', async () => {
    const response = await request
      .put('/users/1')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        id: 1,
        first_name: 'aly',
        last_name: 'fared',
        username: 'admin102'
      });
    expect(response.status).toBe(404);
  });

  it('delete user data ', async () => {
    const response = await request
      .delete('/users/1')
      .set('Authorization', `Bearer ${testToken}`);
    expect(response.status).toBe(200);
  });

  it('should refuse token', async () => {
    const res = await request
      .post('/users/authenticate')
      .set('Content-type', 'application/json')

      .send({
        username: 'fakeuser',
        password: 'fakepass'
      });
    expect(res.status).toBe(400);
  });

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'DELETE FROM users;';
    await conn.query(sql);
    conn.release();
  });

});
