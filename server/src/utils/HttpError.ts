import { NextFunction } from 'express';

class HttpError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = this.constructor.name;
  }

  static notFound(model: object, mess: string) {
    if (!model) {
      const error = new HttpError(404, mess);
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