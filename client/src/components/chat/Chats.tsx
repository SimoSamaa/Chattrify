import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store/index';
import { fetchConversations } from '@/store/chat/actions';
import { useToast } from '@/hooks/use-toast';
import ChatsList from './ChatsList';
import { Input } from '@/components/ui/input';

const Chats = () => {
  const dispatch: AppDispatch = useDispatch();
  const { toast } = useToast();
  const { conversations } = useSelector((state: RootState) => state.chat);
  const [isLoading, setIsLoading] = useState(false);

  const loadConversations = useCallback(async () => {
    try {
      setIsLoading(true);
      await dispatch(fetchConversations());
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error as string,
      });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, toast]);

  useEffect(() => { loadConversations(); }, [loadConversations]);

  return (
    <>
      <div className='p-5'>
        <h2 className="font-semibold text-xl">Chats</h2>
        <div className='mt-4'>
          <Input type="search" placeholder='Search or start a new chat' />
        </div>
      </div>
      <ChatsList conversations={conversations} isLoading={isLoading} />
    </>
  );
};

export default Chats;