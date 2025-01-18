import { createSlice } from '@reduxjs/toolkit';
import type { ConversationInitialState, Conversation } from '@/types/index';

const initialState: ConversationInitialState = {
  conversations: [],
  activeConversation: {},
  notification: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations(state, { payload }: { payload: Conversation[]; }) {
      state.conversations = payload;
    }
  }
});

export const chatSliceActions = chatSlice.actions;
export default chatSlice.reducer;