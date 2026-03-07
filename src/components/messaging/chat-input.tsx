'use client';

import { useState } from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore } from '@/firebase';
import { collection, addDoc, updateDoc, doc } from 'firebase/firestore';

export function ChatInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const { user: authUser } = useUser();
  const firestore = useFirestore();

  const handleSendMessage = async () => {
    if (!message.trim() || !authUser || !firestore || !conversationId) return;

    const currentMessage = message.trim();
    setMessage(''); // Optimistic clear

    try {
      const messagesRef = collection(firestore, `chats/${conversationId}/messages`);
      const newMessage = {
        senderId: authUser.uid,
        text: currentMessage,
        createdAt: new Date(),
        read: false,
      };

      await addDoc(messagesRef, newMessage);

      // Update parent conversation for the chat list
      const chatRef = doc(firestore, 'chats', conversationId);
      await updateDoc(chatRef, {
        lastMessage: newMessage,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="p-4 border-t bg-card">
      <div className="relative">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="pr-32"
        />
        <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5" />
            <span className="sr-only">Record voice message</span>
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
            <span className="sr-only">Attach file</span>
          </Button>
          <Button size="icon" disabled={!message.trim()} onClick={handleSendMessage}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
