import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Message, IMessage, Conversation, IConversation } from '../models/index';
import HttpError from '../utils/HttpError';

type TRequest = Request & { userId: string; };

export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as TRequest).userId;
    const { message, convId, files } = req.body;

    HttpError.validation(req);

    const newMessage: IMessage = await new Message({
      message,
      sender: userId,
      conversation: convId,
      files: files || [],
    }).save();

    if (!newMessage) {
      throw HttpError.badRequest('Oops...Something went wrong!');
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
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    res.status(200).json(populatedMess);

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { convo_id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(convo_id)) {
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    const messages = await Message.find({ conversation: convo_id })
      .populate('sender', 'name picture')
      .populate('conversation');

    if (!messages) {
      throw HttpError.badRequest('Oops...Something went wrong!');
    }

    res.status(200).json(messages);
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};