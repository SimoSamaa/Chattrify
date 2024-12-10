import { Router } from 'express';
import * as conversationControllers from '../controllers/conversation.controller';
import isAuth from '../middleware/isAuth';

const router = Router();

router.post('/', isAuth, conversationControllers.createOpenConversation);

router.get('/', isAuth, conversationControllers.getConversation);

export default router;