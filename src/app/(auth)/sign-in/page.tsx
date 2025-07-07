'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { signIn } from 'next-auth/react';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { signInSchema } from '@/schemas/signInSchema';
import { FaUserSecret } from 'react-icons/fa';

export default function SignInForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const { toast } = useToast();
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast({
          title: 'Login Failed',
          description: 'Incorrect username or password',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    }

    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 overflow-hidden">
      {/* Decorative blurred shape */}
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-purple-600 opacity-30 rounded-full blur-3xl z-0" />
      <div className="relative w-full max-w-md p-8 space-y-8 bg-white/90 rounded-2xl shadow-2xl border border-gray-200 z-10 backdrop-blur-md">
        <div className="flex flex-col items-center text-center">
          <FaUserSecret className="text-5xl text-purple-700 mb-4 drop-shadow-lg" />
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-2 text-gray-900">
            Welcome Back
          </h1>
          <p className="mb-4 text-gray-600 text-lg font-medium">
            Sign in to continue your secret conversations
          </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email/Username</FormLabel>
                  <Input
                    {...field}
                    className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <Input
                    type="password"
                    {...field}
                    className="transition-all focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg transition-all"
              type="submit"
            >
              Sign In
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p className="text-gray-700">
            Not a member yet?{' '}
            <Link
              href="/sign-up"
              className="text-purple-700 font-semibold hover:underline hover:text-indigo-700 transition-all"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}