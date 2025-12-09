'use client';

import { useState } from 'react';
import { conversations as initialConversations, users } from '@/lib/data';
import type { Conversation } from '@/lib/types';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { WelcomeMessage } from '@/components/messaging/welcome-message';
import { cn } from '@/lib/utils';

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

  // This outer div will control the overall layout and height
  return (
    <div className="h-full w-full">
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-[350px_1fr] lg:grid-cols-[400px_1fr] gap-4">
        
        {/* Chat List Column */}
        <div className={cn(
            "flex-col",
            // On mobile, hide the list when a conversation is selected
            selectedConversation ? "hidden md:flex" : "flex"
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
            selectedConversation ? "flex" : "hidden md:flex"
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
    </div>
  );
}
