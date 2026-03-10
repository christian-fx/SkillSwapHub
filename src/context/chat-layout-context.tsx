
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ChatLayoutContextType = {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
};

const ChatLayoutContext = createContext<ChatLayoutContextType | undefined>(undefined);

export function ChatLayoutProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  return (
    <ChatLayoutContext.Provider value={{ isChatOpen, setIsChatOpen, activeChatId, setActiveChatId }}>
      {children}
    </ChatLayoutContext.Provider>
  );
}

export function useChatLayout() {
  const context = useContext(ChatLayoutContext);
  if (context === undefined) {
    throw new Error('useChatLayout must be used within a ChatLayoutProvider');
  }
  return context;
}
