
'use client';

import { formatDistanceToNow } from 'date-fns';
import { ArrowLeft, Search, SquarePen, PlusCircle, Loader2 } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Conversation, User, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, or, getDocs, doc, getDoc, addDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

export type EnrichedConversation = Conversation & {
  otherUser?: UserProfile;
};

interface ChatListProps {
  conversations: EnrichedConversation[];
  selectedConversation: EnrichedConversation | null;
  onSelectConversation: (conversation: EnrichedConversation) => void;
  currentUser: User;
  loading?: boolean;
}

export function ChatList({
  conversations,
  selectedConversation,
  onSelectConversation,
  currentUser,
  loading = false,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [newChatOpen, setNewChatOpen] = useState(false);
  const [connections, setConnections] = useState<UserProfile[]>([]);
  const [loadingConnections, setLoadingConnections] = useState(false);

  const firestore = useFirestore();
  const { user: authUser } = useUser();
  const { toast } = useToast();

  const handleOpenNewChat = async () => {
    if (!authUser || !firestore) return;
    setNewChatOpen(true);
    setLoadingConnections(true);
    try {
      const swapsRef = collection(firestore, 'swaps');
      const q = query(
        swapsRef,
        where('status', '==', 'accepted'),
      );
      const snapshot = await getDocs(q);
      const otherIds = new Set<string>();
      snapshot.docs.forEach(d => {
        const data = d.data();
        if (data.senderId === authUser.uid) otherIds.add(data.receiverId);
        else if (data.receiverId === authUser.uid) otherIds.add(data.senderId);
      });

      const profiles: UserProfile[] = [];
      for (const uid of otherIds) {
        try {
          const userSnap = await getDoc(doc(firestore, 'users', uid));
          if (userSnap.exists()) profiles.push(userSnap.data() as UserProfile);
        } catch { /* ignore */ }
      }
      setConnections(profiles);
    } catch (e) {
      console.error('Error loading connections:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not load connections.' });
    } finally {
      setLoadingConnections(false);
    }
  };

  const handleStartChat = async (otherUser: UserProfile) => {
    if (!authUser || !firestore) return;
    // Check if a chat already exists
    const existingChat = conversations.find(c =>
      c.participants.includes(otherUser.uid) && c.participants.includes(authUser.uid)
    );
    if (existingChat) {
      onSelectConversation(existingChat);
      setNewChatOpen(false);
      return;
    }
    // Create a new chat
    try {
      const chatsRef = collection(firestore, 'chats');
      const newChat = await addDoc(chatsRef, {
        participants: [authUser.uid, otherUser.uid],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      // Build a minimal enriched conversation to open immediately
      const newConv: any = {
        id: newChat.id,
        participants: [authUser.uid, otherUser.uid],
        otherUser,
        updatedAt: new Date(),
      };
      onSelectConversation(newConv);
      setNewChatOpen(false);
    } catch (e) {
      console.error('Error creating chat:', e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not start conversation.' });
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    if (!searchQuery.trim()) return true;
    const otherName = conversation.otherUser?.name || 'Unknown User';
    return otherName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <div className="flex flex-col border-r h-full bg-background">
      <div className="p-4 border-b flex items-center justify-between gap-4 sticky top-0 bg-background z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden" asChild>
            <Link href="/browse"><ArrowLeft className="h-5 w-5" /></Link>
          </Button>
          <h1 className="text-xl font-bold font-headline">Chats</h1>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={handleOpenNewChat}>
            <SquarePen className="h-4 w-4" />
            <span className="sr-only">New Chat</span>
          </Button>
        </div>
      </div>
      <div className="p-4 border-b sticky top-[73px] bg-background z-10">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 rounded-full bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {loading ? (
            // Skeleton loading state
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg">
                <div className="h-12 w-12 rounded-full bg-muted animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-muted animate-pulse" />
                </div>
              </div>
            ))
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full pt-16 text-center">
              <PlusCircle className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">{searchQuery ? "No matches found" : "Start a Conversation"}</h3>
              <p className="text-muted-foreground mt-1 text-sm">{searchQuery ? "Try a different search term." : "Accept a swap request to start chatting."}</p>
            </div>
          ) : (
            filteredConversations.map((conversation) => {
              const isActive = selectedConversation?.id === conversation.id;
              const otherUser = conversation.otherUser;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={cn(
                    'w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors hover:bg-muted/50',
                    isActive ? 'bg-muted' : ''
                  )}
                >
                  <div className="relative shrink-0">
                    <Avatar className="h-12 w-12 border">
                      <AvatarImage
                        src={otherUser?.avatarUrl || `https://avatar.vercel.sh/${conversation.participants.find(id => id !== currentUser.id)}.png`}
                        alt={otherUser?.name || 'User'}
                      />
                      <AvatarFallback>
                        {(otherUser?.name || 'U').charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {otherUser?.status === 'online' && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background bg-green-500" />
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="font-semibold truncate">
                        {otherUser?.name || 'Unknown User'}
                      </h3>
                      {conversation.lastMessage && conversation.lastMessage.createdAt && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(
                            new Date(conversation.lastMessage.createdAt?.toDate ? conversation.lastMessage.createdAt.toDate() : conversation.lastMessage.createdAt),
                            { addSuffix: true }
                          )}
                        </span>
                      )}
                    </div>
                    {conversation.lastMessage ? (
                      <p className={cn("text-sm truncate", conversation.lastMessage.read ? "text-muted-foreground" : "font-semibold text-primary")}>
                        {conversation.lastMessage.text}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic truncate">
                        New conversation
                      </p>
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>

    {/* New Chat Dialog */}
    <Dialog open={newChatOpen} onOpenChange={setNewChatOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>New Chat</DialogTitle>
        </DialogHeader>
        {loadingConnections ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <PlusCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No accepted swap connections yet.</p>
            <p className="text-xs mt-1">Accept a swap request to start chatting.</p>
          </div>
        ) : (
          <ScrollArea className="max-h-[360px]">
            <div className="space-y-1 pr-2">
              {connections.map(user => (
                <button
                  key={user.uid}
                  onClick={() => handleStartChat(user)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-semibold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.location || 'No location'}</p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  </>
  );
}
