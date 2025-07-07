'use client';

import { MessageCard } from '@/components/MessageCard';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Message } from '@/model/User';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { Loader2, RefreshCcw, Copy } from 'lucide-react';
import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema';

function UserDashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch('acceptMessages');

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>('/api/accept-messages');
      setValue('acceptMessages', response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to fetch message settings',
        variant: 'destructive',
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>('/api/get-messages');
        setMessages(response.data.messages || []);
        if (refresh) {
          toast({
            title: 'Refreshed Messages',
            description: 'Showing latest messages',
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: 'Error',
          description:
            axiosError.response?.data.message ?? 'Failed to fetch messages',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages, toast]
  );

  // Fetch initial state from the server
  useEffect(() => {
    if (!session || !session.user) return;

    fetchMessages();

    fetchAcceptMessages();
  }, [session, setValue, toast, fetchAcceptMessages, fetchMessages]);

  // Handle switch change
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      });
      setValue('acceptMessages', !acceptMessages);
      toast({
        title: response.data.message,
        variant: 'default',
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: 'Error',
        description:
          axiosError.response?.data.message ??
          'Failed to update message settings',
        variant: 'destructive',
      });
    }
  };

  if (!session || !session.user) {
    return <div></div>;
  }

  const { username } = session.user as User;

  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: 'URL Copied!',
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div
      className=" py-12 px-2 md:px-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 "
      style={{ minHeight: "91.5vh" }}
    >
      <div className="mx-auto p-8 bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-indigo-100">
        <h1 className="text-4xl font-extrabold mb-6 text-indigo-700 text-center drop-shadow">
          👋 Welcome to Your Dashboard
        </h1>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">
            Copy Your Unique Link
          </h2>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-900 font-mono text-sm"
            />
            <Button
              onClick={copyToClipboard}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
            >
              <Copy className="h-4 w-4" />
              Copy
            </Button>
          </div>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2 text-indigo-700 font-medium">
            Accept Messages:{" "}
            <span
              className={`font-bold ${acceptMessages ? "text-green-600" : "text-red-500"
                }`}
            >
              {acceptMessages ? "On" : "Off"}
            </span>
          </span>
          {isSwitchLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-indigo-500 ml-2" />
          )}
        </div>
        <Separator className="mb-8" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-indigo-700">
            📬 Your Messages
          </h2>
          <Button
            variant="outline"
            className="flex items-center gap-2 border-indigo-300 hover:bg-indigo-50"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCcw className="h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id}
                className="transition-transform hover:scale-[1.02] hover:shadow-lg"
              >
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
              </div>
            ))
          ) : (
            <div className="col-span-2 flex flex-col items-center justify-center py-16 text-center text-gray-500">
              <img
                src="https://illustrations.popsy.co/gray/message-sent.svg"
                alt="No messages"
                className="w-32 mb-4 opacity-80"
              />
              <p className="text-lg font-medium">
                No messages to display yet.<br />
                Share your link to start receiving anonymous messages!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;