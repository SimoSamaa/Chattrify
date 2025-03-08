import express, { Request, Response, NextFunction, Router } from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import HttpError from './utils/HttpError';
import connectRouters from './configs/connectRouters.config';
import startServer from './configs/server.config';

const app = express();
const routers = connectRouters();
const corsOptions = {
  origin: process.env.CLIENT_URL,
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

if (process.env.DEV_MODE === 'development') {
  app.use(morgan('dev'));
  mongoose.set('debug', true);
}

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({ useTempFiles: true }));
app.use(cors(corsOptions));

routers.forEach(({ path, router }) => app.use(path, router));

app.use((_: Request, __: Response, next: NextFunction) => {
  const error = HttpError.badRequest();
  next(error);
});

app.use(async (error: HttpError, _: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message, status });
  next();
});

startServer(app, routers);
export default app;