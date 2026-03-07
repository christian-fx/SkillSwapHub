'use client';

import { ArrowLeft, Phone, Video } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { EnrichedConversation } from './chat-list';
import { ChatActions } from './chat-actions';

interface ChatHeaderProps {
  conversation: EnrichedConversation;
  onBack: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  const participant = conversation.otherUser || { name: 'User', avatarUrl: '', avatarHint: '' };

  return (
    <div className="p-4 border-b flex items-center justify-between gap-4 bg-card">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
        </Button>
        <Avatar>
          <AvatarImage src={participant.avatarUrl} alt={participant.name} />
          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <h2 className="text-lg font-semibold">{participant.name}</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-5 w-5" />
          <span className="sr-only">Audio Call</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-5 w-5" />
          <span className="sr-only">Video Call</span>
        </Button>
        <ChatActions />
      </div>
    </div>
  );
}
