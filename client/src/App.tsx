import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from "@/components/theme-provider";
import { RootState } from '@/store/index';
import GlobalLoading from './components/ui/global-loading';
import router from './router';


const App = () => {
  const { token } = useSelector((state: RootState) => state.auth.user);

  return (
    <ThemeProvider>
      <Suspense fallback={<GlobalLoading />} >
        <Routes>
          <Route
            path={router.home.path}
            element={
              token
                ? <router.home.Ele />
                : <Navigate to={router.auth.login.path} />
            } />

          <Route
            path={router.auth.login.path}
            element={
              token
                ? <Navigate to={router.home.path} />
                : <router.auth.login.Ele />} />

          <Route path={router.auth.signup.path} element={
            token
              ? <Navigate to={router.home.path} />
              : <router.auth.signup.Ele />
          } />

          <Route path={router.notFound.path} element={<router.notFound.Ele />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
};

export default App;