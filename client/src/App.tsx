import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from "@/components/theme-provider";
import { RootState } from '@/store/index';

import Home from './pages/HomePage';
import Login from './pages/LoginPage';
import Signup from './pages/SignupPage';

import { Button } from '@/components/ui/button';

const App = () => {
  const data = useSelector((state: RootState) => state.auth.user);
  console.log('test', data);

  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Button>Click me</Button>
    </ThemeProvider>
  );
};

export default App;