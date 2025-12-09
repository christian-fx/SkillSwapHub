
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Search, SquarePen, PlusCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ChatListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  onSelectConversation: (conversation: Conversation) => void;
  currentUser: User;
}

export function ChatList({
  conversations,
  selectedConversation,
  onSelectConversation,
}: ChatListProps) {
  return (
    <div className="flex flex-col border-r h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between gap-4 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" asChild>
                <Link href="/browse"><ArrowLeft className="h-5 w-5" /></Link>
            </Button>
            <h1 className="text-xl font-bold font-headline">Chats</h1>
        </div>
        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
              <SquarePen className="h-4 w-4" />
              <span className="sr-only">New Chat</span>
            </Button>
        </div>
      </div>
      <div className="p-4 border-b sticky top-[73px] bg-background z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 h-9 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
                <PlusCircle className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Start a Conversation</h3>
                <p className="text-muted-foreground mt-1 text-sm">Click the new chat icon to find someone to talk to.</p>
            </div>
        </div>
      </ScrollArea>
    </div>
  );
}
