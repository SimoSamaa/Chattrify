import { Request, Response, NextFunction } from 'express';
import { hash, genSalt, compare } from 'bcryptjs';
import { Users, IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import generateToken from '../utils/generateToken';

export const signup = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
  try {
    HttpError.validation(req);

    const signupUserData = req.body;

    const salt = await genSalt(12);
    const hashedPassword = await hash(signupUserData.password, salt);

    const user: IUser = new Users({ ...signupUserData, password: hashedPassword });
    await user.save();

    const access_token = await generateToken({ userId: user._id }, 'access', '1d');
    const refresh_token = await generateToken({ userId: user._id }, 'refresh', '30d');

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'User created successfully',
      access_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      }
    });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    HttpError.validation(req);

    const { email, password } = req.body;
    const user: IUser | null = await Users.findOne({ email });

    if (!user) {
      throw HttpError.notFound('A user withe this email could not be found');
    }

    const isPasswordMatch = await compare(password, user!.password);

    if (!isPasswordMatch) {
      throw HttpError.notFound('Invalid password');
    }

    const access_token = await generateToken({ userId: user._id }, 'access', '1d');
    const refresh_token = await generateToken({ userId: user._id }, 'refresh', '30d');

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'login success',
      access_token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
      }
    });

  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken', { path: '/api/v1/refresh-token' });
    res.status(200).json({ message: 'logout' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({ message: 'refresh token' });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};