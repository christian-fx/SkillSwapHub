
'use client';

import { useState, useEffect } from 'react';
import type { Conversation } from '@/lib/types';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { WelcomeMessage } from '@/components/messaging/welcome-message';
import { cn } from '@/lib/utils';
import { useChatLayout } from '@/context/chat-layout-context';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const { setIsChatOpen } = useChatLayout();
  const { user: authUser, loading: userLoading } = useUser();

  // Create a compatible user object for the chat UI
  const currentUser = authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'You',
    avatarUrl: authUser.photoURL || `https://avatar.vercel.sh/${authUser.uid}.png`,
    status: 'online' as const,
  } : null;

  useEffect(() => {
    setIsChatOpen(!!selectedConversation);
    return () => setIsChatOpen(false); // Cleanup on unmount
  }, [selectedConversation, setIsChatOpen]);

  if (userLoading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!currentUser) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center p-8 border rounded-lg bg-card">
          <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
          <p className="text-muted-foreground">You need to be logged in to view your messages.</p>
        </div>
      </div>
    );
  }

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  }

  const isChatOpen = !!selectedConversation;

  return (
    <div className={cn("grid w-full", isChatOpen ? "h-full" : "h-[calc(100svh-120px)]", isChatOpen && "md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr]")}>

      {/* Chat List Column */}
      <div className={cn(
        "flex-col",
        isChatOpen ? "hidden md:flex" : "flex"
      )}>
        <ChatList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          currentUser={currentUser}
        />
      </div>

      {/* Chat Window Column */}
      <div className={cn(
        "flex-col",
        // On mobile, only show this when a conversation is selected
        isChatOpen ? "flex" : "hidden md:flex"
      )}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            currentUser={currentUser}
            onBack={handleBack}
          />
        ) : (
          <WelcomeMessage />
        )}
      </div>
    </div>
  );
}
