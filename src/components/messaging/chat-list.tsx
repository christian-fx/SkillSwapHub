
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Search, Settings, SquarePen } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Conversation, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
                <Link href="/browse"><ArrowLeft className="h-6 w-6" /></Link>
            </Button>
            <h1 className="text-2xl font-bold font-headline">Chats</h1>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="bg-muted rounded-full">
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Button>
            <Button variant="ghost" size="icon" className="bg-muted rounded-full">
              <SquarePen className="h-5 w-5" />
              <span className="sr-only">New Chat</span>
            </Button>
        </div>
      </div>
      <div className="p-4 border-b sticky top-[81px] bg-background z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
       <div className="p-4 border-b">
         <Tabs defaultValue="inbox" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
            <TabsTrigger value="inbox" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full text-base">Inbox</TabsTrigger>
            <TabsTrigger value="communities" className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none rounded-full text-base">Communities</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => onSelectConversation(convo)}
            className={cn(
                'rounded-lg cursor-pointer',
                selectedConversation?.id === convo.id && 'bg-accent'
              )}
          >
            <div className="flex items-center gap-3 p-2">
                <Avatar className="h-14 w-14 border">
                  <AvatarImage
                    src={convo.participant.avatarUrl}
                    alt={convo.participant.name}
                    data-ai-hint={convo.participant.avatarHint}
                  />
                  <AvatarFallback>
                    {convo.participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="font-semibold truncate text-base">{convo.participant.name}</p>
                    <p className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(
                        new Date(convo.lastMessage.timestamp),
                        { addSuffix: true }
                      )}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {convo.lastMessage.text}
                  </p>
                </div>
              </div>
          </div>
        ))}
        </div>
      </ScrollArea>
    </div>
  );
}
