import { sign, verify } from 'jsonwebtoken';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('Token secrets are not defined in environment variables.');
}

export default class Token {
  userId: string;
  iat: number;
  exp: number;

  constructor(userId: string, iat: number, exp: number) {
    this.userId = userId;
    this.iat = iat;
    this.exp = exp;
  }

  static async generateToken(
    payload: object,
    tokenSecure: 'access' | 'refresh',
    expiresIn: string
  ): Promise<string> {

    if (!payload || typeof payload !== 'object') {
      throw new Error('Invalid payload: must be an object.');
    }

    const secretKey = tokenSecure === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      sign(payload, secretKey, { expiresIn }, (error, token) => {
        if (error) {
          console.error('Token generation error:', error);
          reject(null);
        } else {
          resolve(token!);
        }
      });
    });
  };

  static async verifyToken(
    token: string,
    tokenSecure: 'access' | 'refresh'
  ): Promise<Token> {

    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token: must be a string.');
    }

    const secretKey = tokenSecure === 'access' ? ACCESS_TOKEN_SECRET : REFRESH_TOKEN_SECRET;

    return new Promise((resolve, reject) => {
      verify(token, secretKey, (error, payload) => {
        if (error) {
          console.error('Token verification error:', error);
          reject(null);
        } else {
          resolve(payload as Token);
        }
      });
    });
  }
}