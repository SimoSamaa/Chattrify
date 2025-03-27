import React, { useState } from 'react';
import * as authActions from '@/store/auth/actions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/index';
import { Link, useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { z } from 'zod';
import router from '@/router';
import { useInputChange, useValidation } from '@/hooks/custom-hooks';
import { CircleX } from 'lucide-react';
import PulseLoader from 'react-spinners/PulseLoader';
import { BackgroundAnimation } from '@/components/ui/background-animation';

const Login = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setErrorInput] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorLoginForm, setErrorLoginForm] = useState('');

  const loginSchema = z.object({
    email: z.string()
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' }),
    password: z.string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .nonempty({ message: 'Password is required' })
  });

  const validate = useValidation(loginSchema, loginData, setErrorInput);
  const submitLoginForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorLoginForm('');
    const validationSuccess = validate();
    if (!validationSuccess) return;

    try {
      setIsLoading(true);
      await dispatch(authActions.authenticate('login', loginData));
      navigate(router.home.path);
    } catch (error) {
      setErrorLoginForm((error as string));
    } finally {
      setIsLoading(false);
    }
    setLoginData({ email: '', password: '' });
    setIsLoading(false);
  };

  return (
    <div className="h-screen place-content-center px-4">
      <BackgroundAnimation />
      <form onSubmit={submitLoginForm}>
        <Card className="max-w-[400px] w-full mx-auto !bg-card/60 !backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorLoginForm && (
              <Alert className='bg-red-700 border-red-400 mb-5'>
                <CircleX className="size-4 !text-red-300" />
                <AlertTitle className='text-red-300'>
                  Login Failed!
                </AlertTitle>
                <AlertDescription className='text-red-400'>
                  {errorLoginForm}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  onChange={useInputChange('email', setLoginData, setErrorInput, error)}
                  error={error.email}
                  value={loginData.email}
                  placeholder="m@example.com"
                  autoFocus
                  autoComplete="off"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to='/forget-password' className="ml-auto inline-block text-sm underline">
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  onChange={useInputChange('password', setLoginData, setErrorInput, error)}
                  error={error.password}
                  value={loginData.password}
                  placeholder='********' />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <PulseLoader color='#fff' size={11} /> : 'Login'}
              </Button>
              <Button variant="outline" className="w-full">
                Login with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to={router.auth.signup.path} className="underline">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Login;