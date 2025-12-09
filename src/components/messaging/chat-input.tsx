'use client';

import { useState } from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ChatInput() {
  const [message, setMessage] = useState('');

  return (
    <div className="p-4 border-t bg-card">
      <div className="relative">
        <Input
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
          <Button size="icon" disabled={!message.trim()}>
            <Send className="h-5 w-5" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
