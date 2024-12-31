import { body } from 'express-validator';
import { User } from '../../models/index';

export const signup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('First name is required.')
    .isString()
    .withMessage('First name must be a string.')
    .isLength({ min: 3, max: 20 })
    .withMessage('First name must be between 5 and 20 characters long.'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email is invalid.')
    .normalizeEmail()
    .custom(async (value) => {
      const existsEmail = await User.findOne({ email: value });
      if (existsEmail) {
        throw new Error('E-mail already exists! try another one.');
      }
    }),
  body('password')
    .trim()
    .isString()
    .withMessage('Password must be a string.')
    .isLength({ min: 6, max: 64 })
    .withMessage('Password must be between 6 and 64 characters long.')
    .isStrongPassword()
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.'),
  body('status')
    .optional()
    .trim()
    .isString()
    .withMessage('Status must be a string.')
    .isLength({ max: 50 })
    .withMessage('Status must be less than 50 characters long.'),
  body('picture')
    .optional()
    .isURL()
    .withMessage('Picture must be a valid URL.'),
];

export const login = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required.')
    .isEmail()
    .withMessage('Email is invalid.')
    .normalizeEmail(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('password is required.')
    .isString()
    .withMessage('Password must be a string.')
];