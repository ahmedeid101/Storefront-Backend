import { orderStore } from './../models/order';
import express, { Request, Response } from 'express';
import {verifyToken} from '../utilities/encryption'


const store = new orderStore();

const index = async (_req: Request, res: Response) => {
  try {
    const order = await store.index();
    res.json(order);
  } catch (err) {
    res.status(500).send(`thire is error ${err}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const order = await store.show(req.body.id);
    res.json(order);
  } catch (err) {
    res.status(500).send(`thire is an error ${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const order = await store.create(req.body.userId);
    res.json(order);
  } catch (err) {
    res.status(500).send(`thire is an error ${err}`);
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const order = await store.update(req.body.id);
    res.json(order);
  } catch (err) {
    res.status(500).send(`thire is an error  ${err}`);
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const deleted = await store.destroy(req.body.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).send(`thire is an error ${err}`);
  }
};

const orderRoutes = (app: express.Application) => {
  app.get('/orders',verifyToken, index);
  app.get('/orders/:id',verifyToken, show);
  app.post('/orders',verifyToken, create);
  app.put('/orders/:id',verifyToken, update)
  app.delete('/orders/:id',verifyToken, destroy);
};

export default orderRoutes;
