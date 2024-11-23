import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    id: '',
    name: '',
    email: '',
    image: '',
    status: '',
    token: '',
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signup() { },
    login() { },
    logout() { },
    refreshToken() { },
  },
});

export const authSliceActions = authSlice.actions;
export default authSlice.reducer;

