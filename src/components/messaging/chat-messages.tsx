'use client';

import { formatDistanceToNow } from 'date-fns';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { User } from '@/lib/types';
import type { EnrichedConversation } from './chat-list';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

interface ChatMessagesProps {
  conversation: EnrichedConversation;
  currentUser: User;
}

export function ChatMessages({ conversation, currentUser }: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!firestore || !conversation.id) return;

    const messagesRef = collection(firestore, `chats/${conversation.id}/messages`);
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(fetchedMessages);
    });

    return () => unsubscribe();
  }, [conversation.id, firestore]);

  useEffect(() => {
    if (viewportRef.current) {
      viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
    }
  }, [messages]);


  return (
    <ScrollArea className="flex-1" viewportRef={viewportRef}>
      <div className="space-y-4 p-4">
        {messages.map((message) => (
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
                  src={conversation.otherUser?.avatarUrl}
                  alt={conversation.otherUser?.name || 'User'}
                />
                <AvatarFallback>
                  {(conversation.otherUser?.name || 'U').charAt(0)}
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
                {message.createdAt && formatDistanceToNow(new Date(message.createdAt?.toDate ? message.createdAt.toDate() : message.createdAt), {
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
