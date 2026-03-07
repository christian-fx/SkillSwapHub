'use client';

import type { User } from '@/lib/types';
import type { EnrichedConversation } from './chat-list';
import { ChatHeader } from './chat-header';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';

interface ChatWindowProps {
  conversation: EnrichedConversation;
  currentUser: User;
  onBack: () => void;
}

export function ChatWindow({ conversation, currentUser, onBack }: ChatWindowProps) {
  return (
    <div className="flex flex-col border rounded-lg h-full bg-card">
      <ChatHeader conversation={conversation} currentUser={currentUser} onBack={onBack} />
      <ChatMessages conversation={conversation} currentUser={currentUser} />
      <ChatInput conversationId={conversation.id} />
    </div>
  );
}
