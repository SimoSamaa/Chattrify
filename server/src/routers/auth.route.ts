import { Router } from 'express';
import trimRequest from 'trim-request';
import * as authControllers from '../controllers/auth.controller';

const router = Router();

router.post('/login', trimRequest.all, authControllers.login);

router.post('/logout', trimRequest.all, authControllers.logout);

router.post('/refresh-token', trimRequest.all, authControllers.refreshToken);

export default router;