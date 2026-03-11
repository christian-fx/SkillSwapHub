'use client';

import { formatDistanceToNow } from 'date-fns';
import { Check, CheckCheck, Trash2, Ban } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';
import type { EnrichedConversation } from './chat-list';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { useFirestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, writeBatch, doc, updateDoc } from 'firebase/firestore';

interface ChatMessagesProps {
  conversation: EnrichedConversation;
  currentUser: User;
}

export function ChatMessages({ conversation, currentUser }: ChatMessagesProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const firestore = useFirestore();
  const [messages, setMessages] = useState<any[]>([]);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);

  const handleDeleteMessage = async () => {
    if (!firestore || !conversation.id || !messageToDelete) return;

    try {
      const messageRef = doc(firestore, `chats/${conversation.id}/messages`, messageToDelete);
      await updateDoc(messageRef, {
        isDeleted: true,
        text: '',
        imageUrl: null
      });
      // Optionally update the lastMessage if it was the last one, 
      // but firestore triggers will handle the UI for the messages list.
    } catch (error) {
      console.error("Error deleting message:", error);
    } finally {
      setMessageToDelete(null);
    }
  };

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

    const isLastMessageUnread = conversation.lastMessage &&
      conversation.lastMessage.senderId !== currentUser.id &&
      conversation.lastMessage.read === false;

    if (unreadMessagesFromOther.length > 0 || isLastMessageUnread) {
      const batch = writeBatch(firestore);

      // 1. Mark individual messages inside the subcollection as read
      unreadMessagesFromOther.forEach((m) => {
        const messageRef = doc(firestore, `chats/${conversation.id}/messages`, m.id);
        batch.update(messageRef, { read: true });
      });

      // 2. If the last message of the conversation is unread and from the other user, update it
      if (isLastMessageUnread) {
        const chatRef = doc(firestore, 'chats', conversation.id);
        batch.update(chatRef, { 'lastMessage.read': true });
      }

      batch.commit().catch((err) => console.error("Error updating read receipts:", err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages.length, firestore, conversation.id, conversation.lastMessage?.read, currentUser.id]);


  return (
    <ScrollArea className="flex-1" viewportRef={viewportRef}>
      <div className="space-y-2 p-4">
        {messages.map((message, index) => {
          const previousMessage = messages[index - 1];
          const isSameSender = previousMessage?.senderId === message.senderId;
          
          const currentTimestamp = message.createdAt?.toDate ? message.createdAt.toDate().getTime() : new Date(message.createdAt).getTime();
          const previousTimestamp = previousMessage?.createdAt?.toDate ? previousMessage.createdAt.toDate().getTime() : (previousMessage?.createdAt ? new Date(previousMessage.createdAt).getTime() : 0);
          
          const timeDiff = previousMessage ? currentTimestamp - previousTimestamp : Infinity;
          const isGrouped = isSameSender && timeDiff < 5 * 60 * 1000; // 5 minutes threshold
          
          const prevDate = new Date(previousTimestamp);
          const currDate = new Date(currentTimestamp);
          const showDateSeparator = !previousMessage || 
            prevDate.getDate() !== currDate.getDate() || 
            prevDate.getMonth() !== currDate.getMonth() || 
            prevDate.getFullYear() !== currDate.getFullYear();

          const dateLabel = formatDistanceToNow(currDate, { addSuffix: true }).replace('about ', '');

          return (
          <div key={message.id}>
          {showDateSeparator && (
            <div className="flex justify-center my-4">
              <Badge variant="outline" className="text-xs font-normal text-muted-foreground bg-background shadow-sm">
                {currDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </Badge>
            </div>
          )}
          <div
            className={cn(
              'flex items-end gap-2',
              message.senderId === currentUser.id ? 'justify-end' : '',
              isGrouped ? 'mt-1' : 'mt-4'
            )}
          >
            {message.senderId !== currentUser.id && (
              <div className="w-8 shrink-0">
                {!isGrouped && (
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
              </div>
            )}

            <div className="relative group flex items-center gap-2">
              {/* Trash Icon for Current User */}
              {message.senderId === currentUser.id && !message.isDeleted && (
                <AlertDialog open={messageToDelete === message.id} onOpenChange={(open) => !open && setMessageToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute right-full mr-2 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => setMessageToDelete(message.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Message</AlertDialogTitle>
                      <AlertDialogDescription>
                        This message will be deleted for everyone in this chat. It cannot be recovered.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <div
                className={cn(
                  'max-w-xs md:max-w-md lg:max-w-lg p-3 shadow-sm',
                  message.isDeleted
                    ? 'bg-muted text-muted-foreground border border-dashed rounded-lg'
                    : message.senderId === currentUser.id
                      ? cn('bg-primary text-primary-foreground', isGrouped ? 'rounded-l-lg rounded-tr-lg rounded-br-sm' : 'rounded-l-lg rounded-tr-lg rounded-br-none')
                      : cn('bg-card', isGrouped ? 'rounded-r-lg rounded-tl-lg rounded-bl-sm' : 'rounded-r-lg rounded-tl-lg rounded-bl-none')
                )}
              >
                {message.isDeleted ? (
                  <div className="flex items-center gap-2 italic text-sm">
                    <Ban className="h-4 w-4" />
                    This message was deleted
                  </div>
                ) : (
                  <>
                    {message.imageUrl && (
                      <img
                        src={message.imageUrl}
                        alt="Chat image"
                        className="max-w-[200px] sm:max-w-xs md:max-w-sm rounded-md mb-2 object-cover"
                      />
                    )}
                    {message.audioUrl && (
                      <audio
                        controls
                        src={message.audioUrl}
                        className="max-w-[200px] sm:max-w-xs"
                        style={{ height: '36px' }}
                      />
                    )}
                    {message.text && <p className="text-sm">{message.text}</p>}
                  </>
                )}

                <div
                  className={cn(
                    'text-xs mt-1 flex items-center gap-1 justify-end',
                    message.isDeleted
                      ? 'text-muted-foreground/60'
                      : message.senderId === currentUser.id
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                  )}
                >
                  {message.createdAt && formatDistanceToNow(new Date(message.createdAt?.toDate ? message.createdAt.toDate() : message.createdAt), {
                    addSuffix: true,
                  })}
                  {!message.isDeleted && message.senderId === currentUser.id && (
                    message.read ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3" />
                   )}
                 </div>
               </div>
             </div>
           </div>
          </div>
          );
        })}
       </div>
     </ScrollArea>
   );
 }
