import { Request, Response, NextFunction } from 'express';
import HttpError from '../utils/HttpError';

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('data', req.body);
    res.status(200).json({ message: 'login' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'logout' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'refresh token' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};