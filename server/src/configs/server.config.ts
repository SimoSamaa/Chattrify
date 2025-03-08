import { Express } from 'express';
import type { Route } from './types';
import logger from './logger.config';
import mongoose from 'mongoose';

const { PORT, MONGO_DB, DEV_MODE } = process.env;
const port = PORT || 3000;

export default async (app: Express, routers: Route[]) => {
  try {
    await mongoose.connect(MONGO_DB as string);

    app.listen(port, () => {
      process.stdout
        .write(`Server Chattrify is running in -> \x1b[34mhttp://localhost:${port}\x1b[0m\n`);

      if (!(DEV_MODE === 'development')) return;

      console.log('connected router files:');
      routers.forEach(({ path }) => {
        process.stdout.write(`-> \x1b[33m${path.split('/')[3]}\x1b[0m\n`);
      });
    });

  } catch (err) {
    logger.error(`Chattrify error server: ${err}`);
    mongoose.connection.close();
    logger.info('MongoDB connection closed');
    process.exit(1);
  }
};