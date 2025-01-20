import React from 'react';
import { Conversation } from '@/types/index';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatsListProps {
  conversations: Conversation[];
  isLoading: boolean;
}

const ChatsList: React.FC<ChatsListProps> = ({ isLoading, conversations }) => {
  function formatMessageTime(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();

    now.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  }

  return (
    <ul className='flex flex-col gap-1 overflow-auto pl-5 pr-1 pb-2 h-[calc(100vh-119px)] custom-scrollbar relative'>
      {conversations && conversations.length === 0 && !isLoading
        ? (<div className='absolute inset-0 grid place-content-center'>No contact found</div>)
        : (
          <>
            {!isLoading ? (
              <>
                {conversations.map((conversation, ind) => (
                  <li key={conversation.id}>
                    <button className={`flex justify-between items-center px-4 py-2 rounded w-full focus-visible:bg-muted/60 hover:bg-muted/60 duration-300 transition-colors ease-out ${ind === 0 ? 'bg-muted' : ''}`}>
                      <div className='flex items-center gap-3'>
                        <img
                          src={conversation?.picture}
                          alt={conversation?.name}
                          className='size-[46px] rounded-full'
                        />
                        <div className='text-left'>
                          <p className='font-semibold truncate w-[100px]'>{conversation?.name}</p>
                          <p className='text-sm text-muted-foreground truncate w-[100px]'>{conversation?.latestMessage?.message}</p>
                        </div>
                      </div>
                      <div className='text-sm text-muted-foreground'>{formatMessageTime(conversation.latestMessage?.createdAt)}</div>
                    </button>
                  </li>
                ))}
              </>
            ) : (
              Array.from({ length: 9 }, (_, i) => (
                <li key={i} className='flex justify-between items-center px-4 py-2'>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='size-[46px] rounded-full' />
                    <div className='grid gap-2'>
                      <Skeleton className='w-[100px] h-4' />
                      <Skeleton className='w-[140px] h-4' />
                    </div>
                  </div>
                  <Skeleton className='w-[34px] h-4' />
                </li>
              ))
            )}
          </>
        )}
    </ul>
  );
};

export default ChatsList;