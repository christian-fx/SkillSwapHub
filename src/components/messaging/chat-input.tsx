'use client';

import { useState, useRef } from 'react';
import { Paperclip, Send, Mic, MicOff, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser, useFirestore, useStorage } from '@/firebase';
import { collection, addDoc, updateDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function ChatInput({ conversationId }: { conversationId: string }) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

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

  const handleSendMessage = async (imageUrl?: string, audioUrl?: string) => {
    if ((!message.trim() && !imageUrl && !audioUrl) || !authUser || !firestore || !conversationId) return;

    const currentMessage = message.trim();
    if (!imageUrl && !audioUrl) setMessage('');

    try {
      const messagesRef = collection(firestore, `chats/${conversationId}/messages`);
      const newMessage: any = {
        senderId: authUser.uid,
        createdAt: new Date(),
        read: false,
      };

      if (currentMessage) newMessage.text = currentMessage;
      if (imageUrl) newMessage.imageUrl = imageUrl;
      if (audioUrl) newMessage.audioUrl = audioUrl;

      const docRef = await addDoc(messagesRef, newMessage);

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

  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
      return;
    }

    if (!authUser || !storage || !conversationId) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ variant: "destructive", title: "Not supported", description: "Voice recording is not supported on this device." });
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop()); // release mic
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setIsUploading(true);
        try {
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
          const storageRef = ref(storage, `chat-audio/${conversationId}/${fileName}`);
          await uploadBytes(storageRef, audioBlob);
          const downloadUrl = await getDownloadURL(storageRef);
          await handleSendMessage(undefined, downloadUrl);
        } catch (err) {
          console.error("Audio upload error:", err);
          toast({ variant: "destructive", title: "Upload Failed", description: "Could not send voice message." });
        } finally {
          setIsUploading(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Mic error:", err);
      toast({ variant: "destructive", title: "Microphone Error", description: "Could not access your microphone." });
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
      {isRecording && (
        <div className="flex items-center gap-2 text-sm text-destructive mb-2 animate-pulse">
          <div className="h-2 w-2 rounded-full bg-destructive" />
          Recording... tap mic to send
        </div>
      )}
      <div className="relative flex items-center gap-2">
        <Input
          placeholder={isUnverified ? "Please verify your email to chat." : (isRecording ? "Recording..." : "Type a message...")}
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isRecording) handleSendMessage();
          }}
          className={cn("pr-32", isRecording && "opacity-50 pointer-events-none")}
          disabled={isUnverified || isRecording}
        />
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUnverified || isUploading || isRecording}
        />
        <Button
          variant={isRecording ? "destructive" : "ghost"}
          size="icon"
          disabled={isUnverified || isUploading}
          type="button"
          onClick={handleToggleRecording}
          className={cn(isRecording && "animate-pulse")}
        >
          {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          <span className="sr-only">{isRecording ? "Stop recording" : "Record voice message"}</span>
        </Button>
        <Button variant="ghost" size="icon" disabled={isUnverified || isUploading || isRecording} type="button" onClick={() => fileInputRef.current?.click()}>
          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          <span className="sr-only">Attach image</span>
        </Button>
        <Button size="icon" disabled={!message.trim() || isUnverified || isUploading || isRecording} onClick={() => handleSendMessage()} type="button">
          <Send className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
}
