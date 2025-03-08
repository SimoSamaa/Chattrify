import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import * as userService from '../services/user.service';
import logger from '../configs/logger.config';

export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search: keyword } = req.query;

    if (!keyword) {
      logger.info('Search keyword is required');
      throw HttpError.badRequest();
    }

    const users: IUser[] = await userService.searchUsers(keyword as string);

    res.status(200).json(users);
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};