
'use client';

import { useState, useEffect } from 'react';
import type { Conversation } from '@/lib/types';
import { ChatList } from '@/components/messaging/chat-list';
import { ChatWindow } from '@/components/messaging/chat-window';
import { WelcomeMessage } from '@/components/messaging/welcome-message';
import { cn } from '@/lib/utils';
import { useChatLayout } from '@/context/chat-layout-context';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, orderBy } from 'firebase/firestore';
import { Loader2 } from 'lucide-react';
import type { UserProfile } from '@/lib/types';
import type { EnrichedConversation } from '@/components/messaging/chat-list';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<EnrichedConversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<EnrichedConversation | null>(null);

  const { setIsChatOpen } = useChatLayout();
  const { user: authUser, loading: userLoading } = useUser();
  const firestore = useFirestore();

  // Create a compatible user object for the chat UI
  const currentUser = authUser ? {
    id: authUser.uid,
    name: authUser.displayName || 'You',
    email: authUser.email || '',
    avatarUrl: authUser.photoURL || `https://avatar.vercel.sh/${authUser.uid}.png`,
    avatarHint: '',
    bio: '',
    location: '',
    skillsOffered: [],
    skillsNeeded: [],
    rating: 0,
    lastActive: 'Now',
    status: 'online' as const,
  } : null;

  useEffect(() => {
    setIsChatOpen(!!selectedConversation);
    return () => setIsChatOpen(false); // Cleanup on unmount
  }, [selectedConversation, setIsChatOpen]);

  useEffect(() => {
    if (!authUser || !firestore) return;

    const chatsCol = collection(firestore, 'chats');
    // Firestore allows 'array-contains' for querying an array field.
    // We remove orderBy to avoid requiring a custom composite index in Firestore. We sort locally instead.
    const q = query(chatsCol, where('participants', 'array-contains', authUser.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const conversationsPromises = snapshot.docs.map(async (chatDoc) => {
        const data = chatDoc.data();
        const otherUserId = data.participants.find((id: string) => id !== authUser.uid) || data.participants[0];

        let otherUser = undefined;
        if (otherUserId) {
          try {
            const userRef = doc(firestore, 'users', otherUserId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              otherUser = userSnap.data() as UserProfile;
            }
          } catch (e) { console.error('Error fetching chat user profile', e) }
        }

        return {
          id: chatDoc.id,
          ...data,
          otherUser
        } as EnrichedConversation;
      });

      const resolvedConversations = await Promise.all(conversationsPromises);

      // Sort locally by updatedAt descending
      resolvedConversations.sort((a, b) => {
        const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.updatedAt?.getTime ? a.updatedAt.getTime() : 0);
        const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.updatedAt?.getTime ? b.updatedAt.getTime() : 0);
        return timeB - timeA;
      });

      setConversations(resolvedConversations);

      // Update selected conversation with fresh data if it's currently selected
      if (selectedConversation) {
        const updatedSelected = resolvedConversations.find(c => c.id === selectedConversation.id);
        if (updatedSelected) {
          setSelectedConversation(updatedSelected);
        }
      }
    });

    return () => unsubscribe();
  }, [authUser, firestore, selectedConversation?.id]);

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

  const handleSelectConversation = (conversation: EnrichedConversation) => {
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
