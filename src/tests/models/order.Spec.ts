import { Order, orderStore } from '../../models/order';
import { User, userStore } from '../../models/user';
import Client from '../../database';

const orderObj = new orderStore();
const userObj = new userStore();

describe('order model', () => {
  describe('Test Exsistig Methods', () => {
    it('exsist index method', () => {
      expect(orderObj.index).toBeDefined();
    });

    it('exsist show method', () => {
      expect(orderObj.show).toBeDefined();
    });

    it('exsist create method', () => {
      expect(orderObj.create).toBeDefined();
    });

    it('exsist update method', () => {
      expect(orderObj.update).toBeDefined();
    });

    it('exsist delet method', () => {
      expect(orderObj.destroy).toBeDefined();
    });
  });

  describe('Test Order model method', () => {
    let userId: number, orderId: number;

    beforeAll(async () => {
      const user: User = {
        first_name: 'ahmed',
        last_name: 'eid',
        username: 'admin101',
        password: 'root101'
      };

      const createUser = await userObj.create(user);
      userId = createUser.id as unknown as number;

      const order: Order = {
        user_id: userId,
        status: 'active'
      };

      const createOrder = await orderObj.create(order);
      orderId = createOrder.id as unknown as number;
    });

    it('index method should return all users', async () => {
      const orders = await orderObj.index();
      expect(orders.length).toBe(1);
    });

    it('select product method', async () => {
      const result = await orderObj.show(orderId);
      expect(result).toEqual({
        id: orderId,
        user_id: userId,
        status: 'active'
      });
    });

    it('update method', async () => {
      const updatedOrder: Order = {
        id: orderId,
        user_id: userId,
        status: 'active',
      };
      const result = await orderObj.update(updatedOrder);
      expect(result).toEqual({
        id: orderId,
        user_id: userId,
        status: 'active',
      });
    });

    it('detele method', async () => {
      const getAllOrders = await orderObj.index();
      const orderId = getAllOrders[0].id as number;
      await orderObj.destroy(orderId);
      const orders = await orderObj.index();
      expect(orders.length).toEqual(1);
    });
  });

  afterAll(async () => {
    const conn = await Client.connect();
    const sql = 'DELETE FROM orders;';
    await conn.query(sql);
    conn.release();
  });
});
