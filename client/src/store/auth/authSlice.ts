import { createSlice } from '@reduxjs/toolkit';
import type { User, AuthInitialState } from '@/types/index';
import { parseUserInfo } from './authStorage';

const initialState: AuthInitialState = {
  user: parseUserInfo(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLogin(status, { payload }: { payload: User; }) {
      status.user = payload;
    },
    setLogout(status) {
      status.user = {} as User;
    },
    setRefreshToken() { },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;

