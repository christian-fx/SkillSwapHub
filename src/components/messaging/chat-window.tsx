'use client';

import type { Conversation, User } from '@/lib/types';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatWindowProps {
  conversation: Conversation;
  currentUser: User;
  onBack: () => void;
}

export function ChatWindow({ conversation, currentUser, onBack }: ChatWindowProps) {
  return (
    <div className="flex flex-col border rounded-lg h-full bg-card">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessages conversation={conversation} currentUser={currentUser} />
      <ChatInput />
    </div>
  );
}
