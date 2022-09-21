import {verifyToken,createAuthToken} from '../utilities/encryption'
import  jwt  from 'jsonwebtoken';
import express, { Request, Response, NextFunction } from 'express';
import {User, userStore } from '../models/user';
import config from '../config';
 

const store = new userStore();


const index = async (req: Request, res: Response) => {
  try {
    const users = await store.index();
    res.json(users);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send(`${(err as Error).message}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const user = await store.show(id);
    res.json(user);
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send(`${(err as Error).message}`);
  }
};

const create = async (req: Request, res: Response) => {
  const userInfo: User = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    password: req.body.password
  };
  try {
    const user = await store.create(userInfo);
    const token = createAuthToken(user.username);
    res.json(token);
    } catch (err) {
    console.error((err as Error).message);
    res.status(500).send(`${(err as Error).message}`);
  }
};
const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await store.update(req.body);
    res.json({
      statuse: 'success',
      data: { ...user },
      message: 'User updated Successfully'
    });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await store.destroy(parseInt(req.params.id));
    res.json({
      statuse: 'success',
      data: { ...user },
      message: 'User deleted Successfully'
    });
  } catch (err) {
    next(err);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const user = await store.authenticate(req.body.username, req.body.password);
    if (user) {
      const token = createAuthToken(user.username);
      res.json(token);
    } else {
      res.send('Invalid input please check username and password');
    }
  } catch (err) {
    console.error((err as Error).message);
    res.status(500).send(`${(err as Error).message}`);
  }
};


const userRoutes = (app: express.Application) => {
  app.get('/users',verifyToken, index);
  app.get('/users/:id',verifyToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.patch('/users/:id',verifyToken, update);
  app.delete('/users/:id',verifyToken, destroy);
};

export default userRoutes;
