import { User } from '@/types/index';

export const saveUserInfo = (authInfo: User) => {
  try {
    localStorage.setItem('user', JSON.stringify(authInfo));
  } catch (error) {
    console.error("Error saving auth info", error);
  }
};

export const parseUserInfo = (): User => {
  const authString = localStorage.getItem('user');
  try {
    if (authString) {
      const auth = JSON.parse(authString) as User;
      return auth;
    }
  } catch (error) {
    console.error("Error parsing user data from", error);
  }

  return {} as User;
};