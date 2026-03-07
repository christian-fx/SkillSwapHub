'use client';

import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { User } from '@/lib/types';
import type { EnrichedConversation } from './chat-list';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, writeBatch, doc } from 'firebase/firestore';

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

  // Read Receipts Logic
  useEffect(() => {
    if (!firestore || !conversation.id || messages.length === 0) return;

    const unreadMessagesFromOther = messages.filter(
      (m) => m.senderId !== currentUser.id && m.read === false
    );

    if (unreadMessagesFromOther.length > 0) {
      const batch = writeBatch(firestore);

      // 1. Mark individual messages inside the subcollection as read
      unreadMessagesFromOther.forEach((m) => {
        const messageRef = doc(firestore, `chats/${conversation.id}/messages`, m.id);
        batch.update(messageRef, { read: true });
      });

      // 2. If the last message of the conversation is unread and from the other user, update it
      if (
        conversation.lastMessage &&
        conversation.lastMessage.senderId !== currentUser.id &&
        conversation.lastMessage.read === false
      ) {
        const chatRef = doc(firestore, 'chats', conversation.id);
        batch.update(chatRef, { 'lastMessage.read': true });
      }

      batch.commit().catch((err) => console.error("Error updating read receipts:", err));
    }
  }, [messages, firestore, conversation.id, conversation.lastMessage, currentUser.id]);


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
              {message.imageUrl && (
                <img
                  src={message.imageUrl}
                  alt="Chat image"
                  className="max-w-[200px] sm:max-w-xs md:max-w-sm rounded-md mb-2 object-cover"
                />
              )}
              {message.text && <p className="text-sm">{message.text}</p>}
              <div
                className={cn(
                  'text-xs mt-1 flex items-center gap-1 justify-end',
                  message.senderId === currentUser.id
                    ? 'text-primary-foreground/70'
                    : 'text-muted-foreground'
                )}
              >
                {message.createdAt && formatDistanceToNow(new Date(message.createdAt?.toDate ? message.createdAt.toDate() : message.createdAt), {
                  addSuffix: true,
                })}
                {message.senderId === currentUser.id && (
                  message.read ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
