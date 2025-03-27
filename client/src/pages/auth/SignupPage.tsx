import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/index';
import { Link, useNavigate } from 'react-router-dom';
import * as authActions from '@/store/auth/actions';
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
import { useInputChange, useValidation, usePasswordStrength } from '@/hooks/custom-hooks';
import { PasswordStrength } from '@/components/ui/password-strength';
import { CheckCircle, CircleX } from 'lucide-react';
import PulseLoader from 'react-spinners/PulseLoader';
import { BackgroundAnimation } from '@/components/ui/background-animation';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [error, setErrorInput] = useState<Record<string, string>>({});
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorSignupForm, setErrorSignupForm] = useState('');

  const passwordStrength = usePasswordStrength(signupData.password);

  const signupSchema = z.object({
    name: z.string()
      .min(3, { message: 'Full name must be at least 3 characters long' })
      .nonempty({ message: 'Full name is required' })
      .refine((value) => {
        return !/[!@#$%^&*?~()]/.test(value);
      }, { message: 'Full name should not include special characters' }),
    email: z.string()
      .email({ message: 'Invalid email address' })
      .nonempty({ message: 'Email is required' }),
    password: z.string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .refine(() => {
        return (
          passwordStrength.includes('weak') &&
          passwordStrength.includes('medium') &&
          passwordStrength.includes('strong')
        );
      }, { message: 'Password should include uppercase letters, numbers, and special characters (!@#$%^&*)' })
  });

  const validate = useValidation(signupSchema, signupData, setErrorInput);
  const submitSignupForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorSignupForm('');

    const validationSuccess = validate();
    if (!validationSuccess) return;

    try {
      setIsLoading(true);
      await dispatch(authActions.authenticate('signup', signupData));
      setSignupSuccess(true);
      setTimeout(() => {
        navigate(router.auth.login.path);
      }, 3000);
    } catch (error) {
      setErrorSignupForm((error as string));
    } finally {
      setIsLoading(false);
      setSignupData({ name: '', email: '', password: '' });
    }
  };

  return (
    <div className="h-screen place-content-center px-4">
      <BackgroundAnimation />
      <form onSubmit={submitSignupForm}>
        <Card className="max-w-[400px] w-full mx-auto !bg-card/60 !backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl">Signup</CardTitle>
            <CardDescription>
              Create an account to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            {(signupSuccess || errorSignupForm) && (
              <Alert className={`${signupSuccess ? 'bg-green-700 border-green-400' : 'bg-red-700 border-red-400'} mb-5`}>
                {signupSuccess
                  ? (<CheckCircle className="size-4 !text-green-300" />)
                  : (<CircleX className="size-4 !text-red-300" />)}
                <AlertTitle className={`${signupSuccess ? 'text-green-300' : 'text-red-300'}`}>
                  Sign Up {signupSuccess ? 'Successful!' : 'Failed!'}
                </AlertTitle>
                <AlertDescription>
                  {signupSuccess
                    ? (<p className='text-green-400'>Your account has been created successfully. Welcome to Chattrify!</p>)
                    : (<p className='text-red-400'>{errorSignupForm}</p>)}
                </AlertDescription>
              </Alert>
            )}
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="user-name">Username</Label>
                <Input
                  id="user-name"
                  type="text"
                  onChange={useInputChange('name', setSignupData, setErrorInput, error)}
                  error={error.name}
                  value={signupData.name}
                  placeholder='enter your username'
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="text"
                  onChange={useInputChange('email', setSignupData, setErrorInput, error)}
                  error={error.email}
                  value={signupData.email}
                  placeholder="m@example.com"
                  autoComplete='off'
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
                  onChange={useInputChange('password', setSignupData, setErrorInput, error)}
                  error={error.password}
                  value={signupData.password}
                  placeholder='********' />
                <PasswordStrength password={signupData.password} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <PulseLoader color='#fff' size={11} /> : 'Signup'}
              </Button>
              <Button variant="outline" className="w-full">
                Signup with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link to={router.auth.login.path} className="underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default Signup;