import type { User } from './auth.types';

interface Conversation {
  id: string,
  picture: string,
  name: string,
  isGroup: boolean,
  users: Omit<User, 'token'>[],
}

interface ConversationInitialState {
  conversations: Conversation[],
  activeConversation: object,
  notification: [],
}


export type { Conversation, ConversationInitialState };