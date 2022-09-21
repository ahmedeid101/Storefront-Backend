import dotenv from 'dotenv';

dotenv.config();

const {
  PORT,
  NODE_ENV,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DATABASE,
  POSTGRES_DATABASE_TEST,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  BCRYPT_PASSWORD,
  SALT_ROUNDS,
  PEPPER,
  TOKEN_SECRET
} = process.env;

export default {
  port: PORT,
  env: NODE_ENV,
  host: POSTGRES_HOST,
  dbPort: POSTGRES_PORT,
  database: NODE_ENV === 'dev' ? POSTGRES_DATABASE : POSTGRES_DATABASE_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  bcryptPass: BCRYPT_PASSWORD,
  saltRound: SALT_ROUNDS,
  pepper: PEPPER,
  token: TOKEN_SECRET
};
