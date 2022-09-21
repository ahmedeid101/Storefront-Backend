import express, { Application, Request, Response } from 'express';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import userRoutes from './handlers/user';
import productRoutes from './handlers/product';
import orderRoutes from './handlers/order';
import config from './config';

dotenv.config();

const PORT = config.port || 3000; //process.env.PORT || 3000
// create an instance server
const app: Application = express();
// HTTP request logger middleware
app.use(morgan('short'));

// add routing for / path
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Server Starting'
  });
});

userRoutes(app);
productRoutes(app);
orderRoutes(app);

// start express server
app.listen(PORT, () => {
  console.log(`Server is starting at prot:${PORT}`);
});

export default app;
