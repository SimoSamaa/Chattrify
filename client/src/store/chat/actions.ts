import sendHttpRequest from '@/lib/sendHttpRequest';
import { chatSliceActions } from './chatSlice';
import { AppDispatch, RootState } from '../index';
import type { Conversation, User } from '@/types/index';

export const fetchConversations = () => {
  return async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const { token } = getState().auth.user;

    try {
      type TConversation = Conversation & { _id: string; };
      const resData: TConversation[] = await sendHttpRequest('conversation', 'GET', null, token);
      const conversations: Conversation[] = resData.map((convo: TConversation) => {
        return {
          id: convo._id,
          name: convo.name,
          picture: convo.picture,
          isGroup: convo.isGroup,
          users: convo.users.map((user) => {
            return {
              id: (user as Omit<User, 'token'> & { _id: string; })._id,
              name: user.name,
              email: user.email,
              status: user.status,
              picture: user.picture,
            };
          }),
        };
      });

      dispatch(chatSliceActions.setConversations(conversations));
    } catch (error) {
      throw (error as Error).message;
    }
  };
};