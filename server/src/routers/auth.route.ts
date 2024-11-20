import { Router } from 'express';
import reqValidation from '../middleware/reqValidation';
import * as authControllers from '../controllers/auth.controller';

const router = Router();

router.post('/signup', reqValidation, authControllers.signup);

router.post('/login', authControllers.login);

router.post('/refresh-token', authControllers.refreshToken);

export default router;

