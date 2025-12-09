'use client';

import { formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Conversation, User } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface ChatMessagesProps {
  conversation: Conversation;
  currentUser: User;
}

export function ChatMessages({ conversation, currentUser }: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewportRef.current) {
        viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [conversation.messages]);


  return (
    <ScrollArea className="flex-1" viewportRef={viewportRef}>
      <div className="space-y-4 p-4">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex items-end gap-2',
              message.senderId === currentUser.id ? 'justify-end' : ''
            )}
          >
            {message.senderId !== currentUser.id && (
              <Avatar className="h-8 w-8 border">
                <AvatarImage
                  src={conversation.participant.avatarUrl}
                  alt={conversation.participant.name}
                  data-ai-hint={conversation.participant.avatarHint}
                />
                <AvatarFallback>
                  {conversation.participant.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                'max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg shadow-sm',
                message.senderId === currentUser.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card'
              )}
            >
              <p className="text-sm">{message.text}</p>
              <p
                className={cn(
                  'text-xs mt-1',
                  message.senderId === currentUser.id
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {formatDistanceToNow(new Date(message.timestamp), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
