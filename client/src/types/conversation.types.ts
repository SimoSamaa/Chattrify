import type { User } from './auth.types';

interface Conversation {
  id: string,
  picture: string,
  name: string,
  isGroup: boolean,
  users: Omit<User, 'token'>[],
  latestMessage: {
    id: string,
    message: string,
    files: string[],
    createdAt: string,
  };
}

interface ConversationInitialState {
  conversations: Conversation[],
  activeConversation: object,
  notification: [],
}


export type { Conversation, ConversationInitialState };