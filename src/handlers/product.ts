import { Product, productStore } from './../models/product';
import express, { Request, Response } from 'express';
import { verifyToken } from '../utilities/encryption';

const store = new productStore();

const index = async (_req: Request, res: Response) => {
  try {
    const product = await store.index();
    res.json(product);
  } catch (err) {
    res.status(500).send(`thire is error ${err}`);
  }
};

const show = async (req: Request, res: Response) => {
  try {
    const product = await store.show(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).send(`thire is an error ${err}`);
  }
};

const create = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.cattegory,
    rating: req.body.rating
  };
  try {
    const newProduct = await store.create(product);
    res.json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).send(err);
  }
};


const update = async (req: Request, res: Response) => {
  try {
    const product: Product = {
      name: req.body.name as unknown as string,
      price: req.body.price as unknown as number,
      category: req.body.category as unknown as string,
      rating: req.body.rating as unknown as number,
      id: req.body.id as unknown as number,
    };

    if (!product.name || !product.price || !product.id) {
      res.status(404);
      res.json({
        error: 'error occured',
      });
      return;
    }
    const productRes: Product = await store.update(product);
    res.json(productRes);
  } catch (error) {
    res.status(401);
    res.json({
      status: 401,
      method: 'update',
      error: error,
    });
  }
};

const destroy = async (req: Request, res: Response) => {
  try {
    const product = await store.destroy(parseInt(req.params.id));
    res.json(product);
  } catch (err) {
    res.status(500).send(`thire is an error ${err}`);
  }
};

const productRoutes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products',verifyToken, create);
  app.put('/products/:id',verifyToken, update);
  app.delete('/products/:id',verifyToken, destroy);
};

export default productRoutes;
