import { Input } from '@/components/ui/input';

const Chats = () => {
  return (
    <>
      <h2 className="font-semibold text-xl">Chats</h2>
      <div className='mt-4'>
        <Input type="search" placeholder='Search or start a new chat' />
      </div>
    </>
  );
};

export default Chats;