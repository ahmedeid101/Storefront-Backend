import { User, userStore } from '../../models/user';
import Client from '../../database';

const store = new userStore();

describe('User Model', () => {
  describe('Test EXisting Methods', () => {
    it('exsist index method', () => {
      expect(store.index).toBeDefined();
    });

    it('exsist show method', () => {
      expect(store.show).toBeDefined();
    });

    it('exsist create method', () => {
      expect(store.create).toBeDefined();
    });

    it('exsist delet method', () => {
      expect(store.destroy).toBeDefined();
    });

    it('exist authenticate method', () => {
      expect(store.authenticate).toBeDefined();
    });
  });

  describe('Test User Methods Logic', () => {
    const user: User = {
      first_name: 'ahmed',
      last_name: 'eid',
      username: 'admin101',
      password: 'root101'
    };

    beforeAll(async () => {
      const createUser = await store.create(user);
      user.id = createUser.id;
    });

    afterAll(async () => {
      const conn = await Client.connect();
      const sql = 'DELETE FROM users;';
      await conn.query(sql);
      conn.release();
    });

    it('create method should add a new user', async () => {
      const createUser = await store.create({
        first_name: 'medo',
        last_name: 'abdo',
        username: 'admin100',
        password: 'root100'
  
      }as User);
      expect(createUser).toEqual({
        id:createUser.id,
        first_name: 'medo',
        last_name: 'abdo',
        username: 'admin100',
        password:createUser.password
      }as User);
          
    });


    it('index method should return all users', async () => {
      const users = await store.index();
      expect(users.length).toBe(2);
    });

    it('show should return the user with the given id', async () => {
      const oneUser = await store.show(user.id as unknown as number);
      expect(oneUser.id).toBe(user.id);
      expect(oneUser.first_name).toEqual(user.first_name);
      expect(oneUser.last_name).toEqual(user.last_name);
      expect(oneUser.username).toEqual(user.username);
    });

    it('update method should update auser', async () => {
      const updateUser = await store.update({
        ...user,
        first_name: 'aly',
        last_name: 'khaled',
        username: 'update_user'
      });
      expect(updateUser.id).toBe(user.id);
      expect(updateUser.first_name).toBe('aly');
      expect(updateUser.last_name).toBe('khaled');
      expect(updateUser.username).toBe('update_user');
    });

    it('delete method should delete a user', async () => {
      const deleteUser = await store.destroy(user.id as unknown as number);
      expect(deleteUser.id).toBe(user.id);
    });

      it('authantecation method', async () => {
        const username = 'admin101';
        const password = 'root101';
        const result = await store.authenticatedUser(username, password);
        expect(result).toBeDefined();
      });
    });
  });
});
