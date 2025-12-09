'use client';

import { useState } from 'react';
import { conversations as initialConversations, users } from '@/lib/data';
import type { Conversation } from '@/lib/types';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { WelcomeMessage } from '@/components/messaging/welcome-message';

export default function MessagesPage() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  const currentUser = users[0]; // Assuming current user for demo

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBack = () => {
    setSelectedConversation(null);
  }

  return (
    <div className="grid h-[calc(100vh-8rem)] w-full grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] gap-4">
      <div className={selectedConversation ? "hidden md:flex flex-col" : "flex flex-col"}>
        <ChatList
          conversations={conversations}
          selectedConversation={selectedConversation}
          onSelectConversation={handleSelectConversation}
          currentUser={currentUser}
        />
      </div>
      
      <div className={selectedConversation ? "flex flex-col" : "hidden md:flex flex-col"}>
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
