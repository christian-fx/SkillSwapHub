
'use client';

import { useState, useEffect } from 'react';
import { conversations as initialConversations, users } from '@/lib/data';
import type { Conversation } from '@/lib/types';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { WelcomeMessage } from '@/components/messaging/welcome-message';
import { cn } from '@/lib/utils';
import { useChatLayout } from '@/context/chat-layout-context';

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const { setIsChatOpen } = useChatLayout();
    
  const currentUser = users[0]; // Assuming current user for demo

  useEffect(() => {
    setIsChatOpen(!!selectedConversation);
    return () => setIsChatOpen(false); // Cleanup on unmount
  }, [selectedConversation, setIsChatOpen]);

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
