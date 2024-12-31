import { Router } from 'express';
import * as messageControllers from '../controllers/message.controller';
import isAuth from '../middleware/isAuth';
import * as messageValidations from '../middleware/validations/message.validations';

const router = Router();

router.post('/', isAuth, messageValidations.message, messageControllers.sendMessage);

router.get('/:convo_id', isAuth, messageControllers.getMessages);

export default router;