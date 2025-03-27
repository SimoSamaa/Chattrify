import { Request, Response, NextFunction } from 'express';
import { hash, genSalt, compare } from 'bcryptjs';
import { User, IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import Token from '../utils/Token';
import logger from '../configs/logger.config';

export const signup = async (
  req: Request<{}, {}, IUser>,
  res: Response,
  next: NextFunction) => {

  try {
    HttpError.validationReqBody(req);

    const signupUserData = req.body;
    const salt = await genSalt(12);
    const hashedPassword = await hash(signupUserData.password, salt);

    const user: IUser = new User({ ...signupUserData, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    HttpError.validationReqBody(req);

    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean<IUser>();

    if (!user) {
      throw HttpError.badRequest('Invalid login data');
    }

    const isPasswordMatch = await compare(password, user!.password);

    if (!isPasswordMatch) {
      throw HttpError.badRequest('Invalid login data');
    }

    const access_token = await Token.generate({ userId: user._id }, 'access', '1d');
    const refresh_token = await Token.generate({ userId: user._id }, 'refresh', '30d');
    const { password: pass, ...loginData } = user;

    res.cookie('refresh-token', refresh_token, {
      httpOnly: true,
      path: '/api/v1/auth/refresh-token',
      secure: process.env.DEV_MODE === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'login success',
      user: {
        ...loginData,
        token: access_token,
      }
    });

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const logout = async (
  _: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    res.clearCookie('refresh-token', { path: '/api/v1/auth/refresh-token' });
    res.status(200).json({ message: 'logout' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  try {
    const refresh_token = req.cookies['refresh-token'];

    if (!refresh_token) {
      throw HttpError.unauthorized();
    }

    const checkRefreshToken = await Token.verify(refresh_token, 'refresh');
    const user: IUser | null = await User.findById(checkRefreshToken.userId);

    if (!user) {
      throw HttpError.badRequest();
    }

    const access_token = await Token.generate({ userId: user._id }, 'access', '1d');

    res.status(200).json({
      user: {
        ...user.toObject(),
        token: access_token,
      }
    });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};