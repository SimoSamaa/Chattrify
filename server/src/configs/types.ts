import { Router } from 'express';

interface Route {
  path: string;
  router: Router;
}

export type { Route };
