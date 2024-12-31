import { body } from 'express-validator';

export const message = [
  body('message')
    .trim()
    .notEmpty()
    .withMessage('message is required.')
    .isString()
    .withMessage('Message must be a string.'),
  body('convId')
    .trim()
    .notEmpty()
    .withMessage('Conversation ID is required.')
    .isMongoId()
    .withMessage('Invalid Conversation ID.'),
  body('files').
    optional()
    .isArray()
    .withMessage('Files must be an array.')
    .custom((value: string[]) => {
      if (value.length > 0) {
        return value.every((file) => typeof file === 'string');
      }
      return true;
    })
    .withMessage('Files must be an array of strings.'),
];