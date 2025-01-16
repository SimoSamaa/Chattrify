import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/index';
import SidebarHeader from '@/components/layouts/SidebarHeader';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();

  return (
    <div className='pl-[50px]'>
      <SidebarHeader />
      <h1>chat</h1>
    </div>
  );
};

export default Home;
