import { Request, Response, NextFunction } from 'express';
import { Conversation, IConversation, Users, IUser } from '../models/index';
import HttpError from '../utils/HttpError';

type TRequest = Request & { userId: string; };

export const createOpenConversation = async (req: Request, res: Response, next: NextFunction) => {
  const senderId = (req as TRequest).userId;
  const { receiverId } = req.body;

  try {
    if (!receiverId) {
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    // EXISTING CONVERSATION
    let conversations = await Conversation.find({
      isGroup: false,
      users: { $all: [senderId, receiverId] }
    })
      .populate('users', '-password')
      .populate('latestMessage');

    if (!conversations) {
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    // POPULATE SENDER INFO
    conversations = await Users.populate(conversations, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    const existedConversation = conversations[0];

    // CHECK IF CONVERSATION ALREADY EXISTS
    if (existedConversation) {
      res.status(200).json(existedConversation);
    } else {
      // CREATE NEW CONVERSATION
      const receiverUser: IUser | null = await Users.findById(receiverId);
      const newConversation: IConversation = await new Conversation({
        users: [senderId, receiverId],
        isGroup: false,
        name: receiverUser?.name,
      }).save();

      const populateConversation = await Conversation.findById(newConversation._id)
        .populate('users', '-password');

      if (!newConversation || !populateConversation) {
        throw HttpError.badRequest('Oops...Something went wrong!');
      }

      res.status(201).json(populateConversation);
    }
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const getConversation = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as TRequest).userId;

  try {
    const conversations = await Conversation.find({
      users: { $elemMatch: { $eq: userId } },
    })
      .populate('users', '-password')
      .populate('admin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 });

    if (conversations.length === 0) {
      throw HttpError.notFound('No conversations found for this user!');
    }

    if (!conversations) {
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    // POPULATE SENDER INFO
    const populateConversations = await Users.populate(conversations, {
      path: 'latestMessage.sender',
      select: 'name email picture status',
    });

    res.status(200).json(populateConversations);

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};