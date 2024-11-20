import { sign } from 'jsonwebtoken';

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('Token secrets are not defined in environment variables.');
}

const generateToken =
  async (
    payload: object,
    tokenSecure: 'access' | 'refresh',
    expiresIn: string
  ): Promise<string> => {

    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload: must be an object.');
    }

    const secretKey = tokenSecure === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      sign(payload, secretKey, { expiresIn }, (error, token) => {
        if (error) {
          console.error('Token generation error:', error);
          reject(error);
        } else {
          resolve(token!);
        }
      });
    });
  };

export default generateToken;