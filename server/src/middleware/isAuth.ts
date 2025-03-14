import { Request, Response, NextFunction } from 'express';
import Token from '../utils/Token';
import HttpError from '../utils/HttpError';

export default async (req: Request, _: Response, next: NextFunction) => {
  try {
    const token = String(req.header('Authorization'))?.split(' ')[1];

    if (!req.header('Authorization')) {
      throw HttpError.unauthorized();
    }

    try {
      const { userId } = await Token.verify(token, 'access');
      console.log(userId);

      req.userId = userId;
      next();
    } catch (error) {
      throw HttpError.unauthorized('Invalid or expired token');
    }

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};