import { NextFunction, Request } from 'express';
import { validationResult } from 'express-validator';

class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }

  static validation(req: Request) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const error = new HttpError(422, errors.array()[0].msg);
      throw error;
    }
  }

  static serverFail(error: HttpError, next: NextFunction) {
    if (!error.status) {
      error.status = 500;
    }
    next(error);
  }
};

export default HttpError;