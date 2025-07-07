'use client';

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardContent, Card } from '@/components/ui/card';
import { useCompletion } from 'ai/react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';

const specialChar = '||';

const parseStringMessages = (messageString: string): string[] => {
  return messageString.split(specialChar);
};

const initialMessageString =
  "What's your favorite movie?||Do you have any pets?||What's your dream job?";

export default function SendMessage() {
  const params = useParams<{ username: string }>();
  const username = params.username;

  const {
    complete,
    completion,
    isLoading: isSuggestLoading,
    error,
  } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString,
  });

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');

  const handleMessageClick = (message: string) => {
    form.setValue('content', message);
  };

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        username,
      });

      toast({
        title: response.data.message,
        variant: 'default',
      });
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ?? 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggestedMessages = async () => {
    try {
      complete('');
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-2 py-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900"
    
    >
      <div className="w-full max-w-5xl mx-auto bg-white/90 rounded-2xl shadow-2xl border border-indigo-100 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-indigo-700 text-center drop-shadow">
          ✉️ Send an Anonymous Message
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Leave a kind, fun, or thoughtful message for <span className="font-semibold text-indigo-600">@{username}</span>
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-indigo-700 font-medium">
                    Your Message
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write your anonymous message here..."
                      className="resize-none bg-indigo-50 border-indigo-200 focus:border-indigo-400 focus:ring-indigo-200 rounded-lg min-h-[90px] text-indigo-900"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              {isLoading ? (
                <Button disabled className="bg-indigo-400 text-white">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading || !messageContent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-lg shadow"
                >
                  Send It
                </Button>
              )}
            </div>
          </form>
        </Form>

        <div className="space-y-4 my-8">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <Button
              onClick={fetchSuggestedMessages}
              className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold px-4 py-1 rounded shadow"
              disabled={isSuggestLoading}
              type="button"
            >
              <Sparkles className="h-4 w-4 mr-1" />
              Suggest Messages
            </Button>
            <span className="text-gray-500 text-sm ">Click here to take suggestion </span>
          </div>
          <Card className="bg-indigo-50/60 border-indigo-100">
            <CardHeader>
              <h3 className="text-lg font-semibold text-indigo-700">Suggestions</h3>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {error ? (
                <p className="text-red-500">{error.message}</p>
              ) : (
                parseStringMessages(completion).map((message, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="mb-2 border-indigo-200 hover:bg-indigo-100 transition-all duration-150 text-indigo-700 text-wrap w-full h-15"
                    onClick={() => handleMessageClick(message)}
                    type="button"
                  >
                    {message}
                  </Button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
        <Separator className="my-6" />
        <div className="text-center">
          <div className="mb-2 text-gray-600">Want your own anonymous message board?</div>
          <Link href={'/sign-up'}>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg shadow font-semibold">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}