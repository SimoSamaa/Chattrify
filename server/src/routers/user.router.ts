import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import isAuth from '../middleware/isAuth';

const router = Router();

router.get('/', isAuth, userController.searchUsers);

export default router;