'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/messages.json';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  return (
    <>
      {/* Decorative blurred shape */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-purple-700 opacity-30 rounded-full blur-3xl z-0 pointer-events-none" />
      {/* Main content */}
      <main className="relative flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white min-h-screen overflow-x-hidden">
        <section className="text-center mb-8 md:mb-12 z-10">
          <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg">
            Dive into the World of <span className="text-purple-400">Anonymous Feedback</span>
          </h1>
          <p className="mt-4 md:mt-6 text-lg md:text-2xl text-gray-200 font-medium">
            Feedback Hub – Where your identity remains a secret.
          </p>
        </section>

        {/* Call to Action */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 z-10">
          <Link href="/sign-up">
            <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-lg shadow-lg text-lg transition-all">
              Get Started
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button variant="outline" className="border-purple-500 text-purple-200 bg-purple-800/20 font-bold px-8 py-3 rounded-lg text-lg transition-all">
              Sign In
            </Button>
          </Link>
        </div>

        {/* Animated scroll indicator */}
        <div className="flex flex-col items-center mb-6 z-10">
          <span className="animate-bounce text-purple-400 text-3xl">&#8595;</span>
          <span className="text-xs text-gray-300">See what people are saying</span>
        </div>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2500 })]}
          className="w-full max-w-lg md:max-w-xl z-10"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card className="bg-white/20 backdrop-blur-md border border-white/30 shadow-xl rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-purple-100">{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0 text-purple-400 w-8 h-8" />
                    <div>
                      <p className="text-white text-base">{message.content}</p>
                      <p className="text-xs text-gray-300 mt-2">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="bg-purple-700/80 hover:bg-purple-800/90 text-white" />
            <CarouselNext className="bg-purple-700/80 hover:bg-purple-800/90 text-white" />
          </div>
        </Carousel>
      </main>

      {/* Footer */}
      <footer className="text-center p-6 bg-gray-900 text-gray-300 border-t border-gray-800 z-10">
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <span>© {new Date().getFullYear()} Feedback Hub. All rights reserved.</span>
          <span className="hidden md:inline">|</span>
          <Link href="/privacy" className="hover:underline text-purple-400">Privacy Policy</Link>
          <Link href="/about" className="hover:underline text-purple-400">About</Link>
        </div>
      </footer>
    </>
  );
}