import fs from 'fs';
import path from 'path';
import logger from './logger.config';
import type { Route } from './types';

const connectRouters = (): Route[] => {
  const routerFiles = fs.readdirSync(path.resolve(__dirname, '..', 'routers'));
  const routers: Route[] = [];

  if (routerFiles.length === 0) {
    logger.error('Error loading router files: No router files found');
    process.exit(1);
  }

  routerFiles.forEach((file) => {
    try {
      const router = require(`../routers/${file}`).default;
      const path = `/api/v1/${file.split('.')[0]}/`;
      if (router) routers.push({ path, router });
    } catch (error) {
      if (!(error instanceof Error)) return;
      logger.error(`Error loading router files: ${error.message}`);
    }
  });

  return routers;
};

export default connectRouters;