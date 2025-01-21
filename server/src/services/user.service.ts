import { IUser, User } from '../models/index';

export const searchUsers = async (keyword: string): Promise<IUser[]> => {
  const users = await User.find({
    $or: [
      { name: { $regex: keyword, $options: 'i' } },
      { email: { $regex: keyword, $options: 'i' } }
    ]
  });

  return users;
};