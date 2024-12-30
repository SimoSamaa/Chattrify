import { Router } from 'express';
import * as authValidations from '../middleware/validations/auth.validations';
import * as authControllers from '../controllers/auth.controller';

const router = Router();

router.post('/signup', authValidations.signup, authControllers.signup);

router.post('/login', authValidations.login, authControllers.login);

router.post('/logout', authControllers.logout);

router.post('/refresh-token', authControllers.refreshToken);

export default router;