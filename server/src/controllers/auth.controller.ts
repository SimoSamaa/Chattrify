import { Request, Response, NextFunction } from 'express';
import { hash, genSalt, compare } from 'bcryptjs';
import { User, IUser } from '../models/index';
import HttpError from '../utils/HttpError';
import Token from '../utils/Token';

export const signup = async (req: Request<{}, {}, IUser>, res: Response, next: NextFunction) => {
  try {
    HttpError.validation(req);

    const signupUserData = req.body;

    const salt = await genSalt(12);
    const hashedPassword = await hash(signupUserData.password, salt);

    const user: IUser = new User({ ...signupUserData, password: hashedPassword });
    await user.save();

    const access_token = await Token.generate({ userId: user._id }, 'access', '1d');
    const refresh_token = await Token.generate({ userId: user._id }, 'refresh', '30d');

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token,
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
    const user: IUser | null = await User.findOne({ email });

    if (!user) {
      throw HttpError.notFound('A user withe this email could not be found');
    }

    const isPasswordMatch = await compare(password, user!.password);

    if (!isPasswordMatch) {
      throw HttpError.notFound('Invalid password');
    }

    const access_token = await Token.generate({ userId: user._id }, 'access', '1d');
    const refresh_token = await Token.generate({ userId: user._id }, 'refresh', '30d');

    res.cookie('refreshToken', refresh_token, {
      httpOnly: true,
      path: '/api/v1/refresh-token',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'login success',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token,
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
    const refresh_token = req.cookies.refreshToken;

    if (!refresh_token) {
      throw HttpError.unauthorized('Please login.');
    }

    const checkRefreshToken = await Token.verify(refresh_token, 'refresh');
    const user: IUser | null = await User.findById(checkRefreshToken.userId);

    if (!user) {
      throw HttpError.badRequest('Please fill all the required fields.');
    }

    const access_token = await Token.generate({ userId: user._id }, 'access', '1d');

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        status: user.status,
        token: access_token,
      }
    });
  } catch (error) {
    HttpError.serverFail(error as HttpError, next);
  }
};