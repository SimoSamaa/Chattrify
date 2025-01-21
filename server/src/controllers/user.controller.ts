import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import * as userService from '../services/user.service';

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search: keyword } = req.query;

    if (!keyword) {
      console.error('Search keyword is required.');
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    const users: IUser[] = await userService.searchUsers(keyword as string);

    res.status(200).json(users);
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};