import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Message, IMessage, Conversation, IConversation } from '../models/index';
import HttpError from '../utils/HttpError';
import logger from '../configs/logger.config';

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    const { message, convId, files } = req.body;

    HttpError.validationReqBody(req);

    const conversationExist: IConversation | null = await Conversation.findById(convId);
    if (!conversationExist) {
      logger.info('Conversation not found');
      throw HttpError.badRequest();
    }

    const newMessage: IMessage = await new Message({
      message,
      sender: userId,
      conversation: convId,
      files: files || [],
    }).save();

    if (!newMessage) {
      logger.info('Message not saved');
      throw HttpError.badRequest();
    }

    const populatedMess = await Message.findById(newMessage._id)
      .populate({
        path: 'sender',
        select: 'name picture',
        model: 'User',
      })
      .populate({
        path: 'conversation',
        select: 'name isGroup users',
        model: 'Conversation',
        populate: {
          path: 'users',
          select: 'name email picture status',
          model: 'User',
        },
      });

    const conversation: IConversation | null = await Conversation.findByIdAndUpdate(convId,
      {
        latestMessage: newMessage,
      });

    if (!populatedMess || !conversation) {
      logger.info('Message not populated');
      throw HttpError.badRequest();
    }

    res.status(200).json(populatedMess);

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { convo_id } = req.params;
    const userId = req.userId;
    console.log(userId);

    if (!mongoose.Types.ObjectId.isValid(convo_id)) {
      logger.info('Invalid conversation ID');
      throw HttpError.badRequest();
    }

    const conversation: IConversation | null = await Conversation.findById(convo_id);
    const isUserInConversation = conversation?.users.some((user) => user.toString() === userId);
    if (!conversation || !isUserInConversation) {
      logger.info('Conversation not found');
      throw HttpError.badRequest();
    }

    const messages = await Message.find({ conversation: convo_id })
      .populate('sender', 'name picture')
      .populate('conversation');

    if (!messages) {
      logger.info('Messages not found');
      throw HttpError.badRequest();
    }

    res.status(200).json(messages);
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};