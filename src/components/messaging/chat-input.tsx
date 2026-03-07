'use client';

import { useState, useRef } from 'react';
import { Paperclip, Send, Mic, Loader2, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';

export function ChatInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { user: authUser } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();

  const isEmailAuth = authUser?.providerData.some((p) => p.providerId === 'password');
  const isUnverified = isEmailAuth && !authUser?.emailVerified;

  const handleTyping = async (text: string) => {
    setMessage(text);
    if (!authUser || !conversationId) return;

    try {
      const chatRef = doc(firestore, 'chats', conversationId);

      // Set typing
      await updateDoc(chatRef, {
        typingUsers: arrayUnion(authUser.uid)
      });

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds
      typingTimeoutRef.current = setTimeout(async () => {
        try {
          await updateDoc(chatRef, {
            typingUsers: arrayRemove(authUser.uid)
          });
        } catch (e) { /* ignore */ }
      }, 2000);

    } catch (error) {
      console.error("Typing error", error);
    }
  };

  const handleSendMessage = async (imageUrl?: string) => {
    if ((!message.trim() && !imageUrl) || !authUser || !firestore || !conversationId) return;

    const currentMessage = message.trim();
    if (!imageUrl) setMessage(''); // Optimistic clear for text-only

    try {
      const messagesRef = collection(firestore, `chats/${conversationId}/messages`);
      const newMessage: any = {
        senderId: authUser.uid,
        createdAt: new Date(),
        read: false,
      };

      if (currentMessage) newMessage.text = currentMessage;
      if (imageUrl) newMessage.imageUrl = imageUrl;

      const docRef = await addDoc(messagesRef, newMessage);

      // Fetch the actual doc to trigger local onSnapshot with a stable ID if needed, 
      // but firestore handles this. We just need to update the parent chat for the list.
      const chatRef = doc(firestore, 'chats', conversationId);
      await updateDoc(chatRef, {
        lastMessage: { ...newMessage, id: docRef.id },
        updatedAt: new Date()
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to send message." });
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !authUser || !storage || !conversationId) return;

    if (!file.type.startsWith('image/')) {
      toast({ variant: "destructive", title: "Invalid File Document", description: "Only image uploads are supported." });
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const storageRef = ref(storage, `chat-images/${conversationId}/${fileName}`);

      await uploadBytes(storageRef, file);
      const downloadUrl = await getDownloadURL(storageRef);

      await handleSendMessage(downloadUrl);

    } catch (error) {
      console.error("Error uploading image:", error);
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload image." });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="p-4 border-t bg-card">
      <div className="relative">
        <Input
          placeholder={isUnverified ? "Please verify your email to chat." : "Type a message..."}
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="pr-32"
          disabled={isUnverified}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUnverified || isUploading}
        />
        <Button variant="ghost" size="icon" disabled={isUnverified} type="button">
          <Mic className="h-5 w-5" />
          <span className="sr-only">Record voice message</span>
        </Button>
        <Button variant="ghost" size="icon" disabled={isUnverified || isUploading} type="button" onClick={() => fileInputRef.current?.click()}>
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          <span className="sr-only">Attach image</span>
        </Button>
        <Button size="icon" disabled={!message.trim() || isUnverified || isUploading} onClick={() => handleSendMessage()} type="button">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
