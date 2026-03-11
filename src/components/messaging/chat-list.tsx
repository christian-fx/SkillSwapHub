
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Search, SquarePen, PlusCircle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation, User, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';

export type EnrichedConversation = Conversation & {
  otherUser?: UserProfile;
};

interface ChatListProps {
  conversations: EnrichedConversation[];
  selectedConversation: EnrichedConversation | null;
  onSelectConversation: (conversation: EnrichedConversation) => void;
  currentUser: User;
}

export function ChatList({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUser,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery.trim()) return true;
    const otherName = conversation.otherUser?.name || 'Unknown User';
    return otherName.toLowerCase().includes(searchQuery.toLowerCase());
  });

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
              <PlusCircle className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">{searchQuery ? "No matches found" : "Start a Conversation"}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{searchQuery ? "Try a different search term." : "Accept a swap request to start chatting."}</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = selectedConversation?.id === conversation.id;
              const otherUser = conversation.otherUser;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50',
                    isActive ? 'bg-muted' : ''
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage
                        src={otherUser?.avatarUrl || `https://avatar.vercel.sh/${conversation.participants.find(id => id !== currentUser.id)}.png`}
                        alt={otherUser?.name || 'User'}
                      />
                      <AvatarFallback>
                        {(otherUser?.name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {otherUser?.status === 'online' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-semibold truncate">
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                      {conversation.lastMessage && conversation.lastMessage.createdAt && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(conversation.lastMessage.createdAt?.toDate ? conversation.lastMessage.createdAt.toDate() : conversation.lastMessage.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className={cn("text-sm truncate", conversation.lastMessage.read ? "text-muted-foreground" : "font-semibold text-primary")}>
                        {conversation.lastMessage.text}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic truncate">
                        New conversation
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
