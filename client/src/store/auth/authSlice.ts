import { createSlice } from '@reduxjs/toolkit';
import type { User, AuthInitialState } from '@/types/index';

const parseUserData = (): User => {
  const userString = localStorage.getItem('user');
  try {
    if (userString) {
      const user = JSON.parse(userString);
      // Check if the token has expired
      // if (user?.token && Date.now() - user.tokenTimestamp > EXPIRATION_TIME) {
      //   localStorage.removeItem('user'); // Clear expired token
      //   return {} as User;
      // }
      return user;
    }
  } catch (error) {
    console.error("Error parsing user data from localStorage", error);
  }
  return {} as User;
};

const initialState: AuthInitialState = {
  user: parseUserData(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignup(status, { payload }: { payload: User; }) {
      status.user = payload;
    },
    setLogin(status, { payload }: { payload: User; }) {
      status.user = payload;
      console.log('login data', status.user);

    },
    setLogout() { },
    setRefreshToken() { },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;

