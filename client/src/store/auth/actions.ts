import sendHttpRequest from '@/lib/sendHttpRequest';
import type { User } from '@/types/index';
import { AppDispatch } from '../index';
import { authSliceActions } from './authSlice';

type Response = { user: User, message: string; };

const saveUserData = (userItem: User) => {
  try {
    localStorage.setItem('user', JSON.stringify({ ...userItem }));
  } catch (error) {
    console.error("Error saving user data to localStorage", error);
  }
};

export const signup = (payload: Pick<User, 'name' | 'email'> & { password: string; }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res: Response = await sendHttpRequest('signup', 'POST', payload);
      dispatch(authSliceActions.setSignup({ ...res.user }));
      saveUserData({ ...res.user });
    } catch (error) {
      throw (error as Error).message;
    }
  };
};

export const login = (payload: { email: string, password: string; }) => {
  return async (dispatch: AppDispatch) => {
    try {
      const res: Response = await sendHttpRequest('login', 'POST', payload);
      dispatch(authSliceActions.setLogin({ ...res.user }));
      saveUserData({ ...res.user });
    } catch (error) {
      throw (error as Error).message;
    }
  };
};

export const logout = () => {
  return (dispatch: AppDispatch) => {
    dispatch(authSliceActions.setLogout());
    localStorage.removeItem('user');
  };
};