import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import fs from 'fs';
import HttpError from './utils/HttpError';

const app = express();
const { MONGO_DB } = process.env;
const PORT = process.env.PORT || 3000;
const routerFiles = fs.readdirSync(path.join(__dirname, 'routers'));
const corsOptions = {
  origin: `*`,
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
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

const connectRouters = () => {
  routerFiles.forEach((file) => {
    try {
      app.use(`/api/v1/${file.split('.')[0]}/`, require(`./routers/${file}`).default);
    } catch (error) {
      if (!(error instanceof Error)) return;
      console.log(`Error loading router files: ${error.message}`);
    }
  });
};

connectRouters();

app.use((_: Request, __: Response, next: NextFunction) => {
  const error = HttpError.notFound();
  next(error);
});

app.use(async (error: HttpError, _: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({ message, status });
  next();
});

mongoose.connect(MONGO_DB as string)
  .then(() => {
    app.listen(PORT, () => {
      process.stdout
        .write(`Server Chattrify is running in -> \x1b[34mhttp://localhost:${PORT}\x1b[0m\n`);
      console.log('connected router files:');
      routerFiles.forEach((file) => {
        process.stdout.write(`-> \x1b[33m${file.split('.')[0]}\x1b[0m\n`);
      });
    });
  })
  .catch((err: Error) => {
    console.log(`Chattrify error server: ${err}`);
    mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(1);
  });