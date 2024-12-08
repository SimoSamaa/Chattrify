import { logout } from '@/store/auth/actions';
import { Button } from '@/components/ui/button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/index';

const Home = () => {
  const dispatch: AppDispatch = useDispatch();

  const test = () => {
    dispatch(logout());
  };

  return (
    <>
      <h1>HOME</h1>
      <Button onClick={test}>logout</Button>
    </>
  );
};

export default Home;
