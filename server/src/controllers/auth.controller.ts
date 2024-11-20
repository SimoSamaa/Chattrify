import { Request, Response, NextFunction } from 'express';
import { hash, genSalt } from 'bcryptjs';
import { Users, IUser } from '../models/index';
import HttpError from '../utils/HttpError';

export const signup = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
  try {
    HttpError.validation(req);

    const signupUserData = req.body;

    const salt = await genSalt(12);
    const hashedPassword = await hash(signupUserData.password, salt);

    const user = new Users({ ...signupUserData, password: hashedPassword });
    await user.save();

    res.status(201).json({ user });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('data', req.body);
    res.status(200).json({ message: 'login' });
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