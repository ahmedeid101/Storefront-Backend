import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import config from '../config';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

const {TOKEN_SECRET} = process.env

dotenv.config();

export const hashPassword = (password: string) => {
  const salt = parseInt(config.saltRound as string, 10);
  return bcrypt.hashSync(password + config.pepper, salt);
};

export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authorizationHeader = req.headers.authorization;
    const token = authorizationHeader ? authorizationHeader.split(' ')[1] : '';
    jwt.verify(token, `${config.token}`);

    next();
  } catch (error) {
    res.status(401);
  }
};

export const createAuthToken = (username: string): string => {
  return jwt.sign({ username: username }, TOKEN_SECRET as unknown as string);
};
export const checkPassword = (plainTextPassword: string, hashedPassword: string): boolean =>
  bcrypt.compareSync(`${plainTextPassword}${config.pepper}`, `${hashedPassword}`) ? true : false;
