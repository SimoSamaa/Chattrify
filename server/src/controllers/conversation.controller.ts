import { Request, Response, NextFunction } from 'express';
import { Conversation, IConversation, User, IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import logger from '../configs/logger.config';

export const createOpenConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const senderId = req.userId;
    const { receiverId } = req.body;

    if (!receiverId) {
      logger.info('Receiver ID is required');
      throw HttpError.badRequest();
    }

    // EXISTING CONVERSATION
    let conversations = await Conversation.find({
      isGroup: false,
      users: { $all: [senderId, receiverId] }
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (!conversations) {
      logger.info('Conversations not found');
      throw HttpError.badRequest();
    }

    // POPULATE SENDER INFO
    conversations = await User.populate(conversations, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    const existedConversation = conversations[0];

    // CHECK IF CONVERSATION ALREADY EXISTS
    if (existedConversation) {
      res.status(200).json(existedConversation);
    } else {
      // CREATE NEW CONVERSATION
      const receiverUser: IUser | null = await User.findById(receiverId);
      const newConversation: IConversation = await new Conversation({
        users: [senderId, receiverId],
        picture: receiverUser?.picture,
        isGroup: false,
        name: receiverUser?.name,
      }).save();

      const populateConversation = await Conversation.findById(newConversation._id)
        .populate('users', '-password');

      if (!newConversation || !populateConversation) {
        logger.info('Conversation not created');
        throw HttpError.badRequest();
      }

      res.status(201).json(populateConversation);
    }
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const getConversation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const userId = req.userId;
    const conversations = await Conversation.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate('users', '-password')
      .populate('admin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    if (conversations.length === 0) {
      res.status(200).json([]);
      return;
    }

    if (!conversations) {
      logger.info('Conversations not found');
      throw HttpError.badRequest();
    }

    // POPULATE SENDER INFO
    const populateConversations = await User.populate(conversations, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    res.status(200).json(populateConversations);

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};