import { lazy } from 'react';

const routes = {
  auth: {
    login: {
      name: 'login',
      path: '/auth/login',
      Ele: lazy(() => import('@/pages/auth/LoginPage'))
    },
    signup: {
      name: 'signup',
      path: '/auth/signup',
      Ele: lazy(() => import('@/pages/auth/SignupPage')),
    },
  },
  home: {
    name: 'home',
    path: '/',
    Ele: lazy(() => import('@/pages/HomePage')),
  },
  notFound: {
    name: 'notFound',
    path: '*',
    Ele: lazy(() => import('@/pages/NotFoundPage')),
  }
};

export default routes;
