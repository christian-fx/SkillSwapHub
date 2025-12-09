
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Plus, Search } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Conversation, User } from '@/lib/types';
import { cn } from '@/lib/utils';

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
  currentUser,
}: ChatListProps) {
  return (
    <div className="flex flex-col border rounded-lg h-full bg-card">
      <div className="p-4 border-b flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Chats</h1>
        <Button variant="ghost" size="icon">
          <Plus className="h-6 w-6" />
          <span className="sr-only">New Chat</span>
        </Button>
      </div>
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search chats..."
            className="pl-8"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {conversations.map((convo) => (
          <div
            key={convo.id}
            onClick={() => onSelectConversation(convo)}
          >
            <div
              className={cn(
                'p-4 cursor-pointer hover:bg-accent',
                selectedConversation?.id === convo.id && 'bg-accent'
              )}
            >
              <div className="flex items-start gap-4">
                <Avatar className="border">
                  <AvatarImage
                    src={convo.participant.avatarUrl}
                    alt={convo.participant.name}
                    data-ai-hint={convo.participant.avatarHint}
                  />
                  <AvatarFallback>
                    {convo.participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold">{convo.participant.name}</p>
                    <p className="text-xs text-muted-foreground">
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
            <Separator />
          </div>
        ))}
      </ScrollArea>
    </div>
  );
}
