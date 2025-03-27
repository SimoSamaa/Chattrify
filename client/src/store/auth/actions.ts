import sendHttpRequest from '@/lib/sendHttpRequest';
import type { User } from '@/types/index';
import { AppDispatch } from '../index';
import { authSliceActions } from './authSlice';
import { saveUserInfo } from './authStorage';

type Response = { user: User, message: string; };
type authenticatePayload = { name?: string, email: string, password: string; };

export const authenticate = (
  type: 'signup' | 'login',
  payload: authenticatePayload
) => {

  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      const res = await sendHttpRequest<Response>(`auth/${type}`, 'POST', payload);

      if (type === 'login') {
        dispatch(authSliceActions.setLogin({ ...res.user }));
        saveUserInfo({ ...res.user });;
      }

    } catch (error) {
      throw (error as Error).message;
    }
  };
};

// export const login = (payload: { email: string, password: string; }) => {
//   return async (dispatch: AppDispatch): Promise<void> => {
//     try {
//       const res: Response = await sendHttpRequest('auth/login', 'POST', payload);
//       dispatch(authSliceActions.setLogin({ ...res.user }));
//       saveUserInfo({ ...res.user });
//     } catch (error) {
//       throw (error as Error).message;
//     }
//   };
// };

// export const authenticate = (
//   type: 'signup' | 'login',
//   payload: authPayload
// ) => {
//   return async (dispatch: AppDispatch): Promise<void> => {
//     try {
//       const res = await sendHttpRequest<Response>(`auth/${type}`, 'POST', payload);

//       if (type === 'login') {
//         const expiresAt = Date.now() + res.auth.expiresIn;
//         const authInfo = { ...res.auth, expiresIn: expiresAt };
//         dispatch(authSliceActions.setLogin(authInfo));
//         saveAuthInfo(authInfo);
//       }

//     } catch (error) {
//       throw (error as Error).message;
//     }
//   };
// };

export const logout = () => {
  return (dispatch: AppDispatch) => {
    localStorage.removeItem('user');
    dispatch(authSliceActions.setLogout());
  };
};