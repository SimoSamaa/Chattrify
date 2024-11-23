import { Router } from 'express';
import * as reqValidation from '../middleware/reqValidation';
import * as authControllers from '../controllers/auth.controller';

const router = Router();

router.post('/signup', reqValidation.signup, authControllers.signup);

router.post('/login', reqValidation.login, authControllers.login);

router.post('/logout', authControllers.logout);

router.post('/refresh-token', authControllers.refreshToken);

export default router;