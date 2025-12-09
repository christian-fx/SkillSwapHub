
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type ChatLayoutContextType = {
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
};

const ChatLayoutContext = createContext<ChatLayoutContextType | undefined>(undefined);

export function ChatLayoutProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <ChatLayoutContext.Provider value={{ isChatOpen, setIsChatOpen }}>
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
