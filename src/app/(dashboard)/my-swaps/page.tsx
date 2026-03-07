'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { SwapRequest, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRightLeft, Calendar, Check, Clock, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, or, doc, getDoc, updateDoc, addDoc } from 'firebase/firestore';

export type EnrichedSwapRequest = SwapRequest & {
  otherUser?: UserProfile;
};

const SwapCard = ({ swap, currentUserId, onUpdateStatus }: { swap: EnrichedSwapRequest, currentUserId: string, onUpdateStatus: (id: string, status: string) => void }) => {
  const isPending = swap.status === 'pending';
  const isCompleted = swap.status === 'completed';
  const isUpcoming = swap.status === 'accepted';
  const isReceiver = swap.receiverId === currentUserId; // True if someone proposed TO the current user

  const otherUserName = swap.otherUser?.name || 'Unknown User';
  const otherUserAvatar = swap.otherUser?.avatarUrl || `https://avatar.vercel.sh/${swap.senderId === currentUserId ? swap.receiverId : swap.senderId}.png`;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={otherUserAvatar} alt={otherUserName} />
            <AvatarFallback>{otherUserName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">Swap with {otherUserName}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm mt-1">
              {isUpcoming || isCompleted ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {swap.createdAt ? format(new Date(swap.createdAt?.toDate ? swap.createdAt.toDate() : swap.createdAt), isCompleted ? 'PPP' : 'PPP p') : 'Unknown Date'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/*
            Phase 3 Note: Since we decoupled the hardcoded User object in the schema 
            but kept the simplified component strings, we might need a richer UI later.
            For now, we'll just display a generic "Requested a swap" message since 
            skills aren't string scalars on the new component structure explicitly anymore, 
            but rely on the message. 
        */}
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-secondary/30 rounded-md border">"{swap.message || 'I would like to swap skills!'}"</p>
      </CardContent>
      {isPending && isReceiver && (
        <CardFooter className="gap-2">
          <Button className="w-full" onClick={() => onUpdateStatus(swap.id, 'accepted')}>
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button variant="outline" className="w-full" onClick={() => onUpdateStatus(swap.id, 'declined')}>
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </CardFooter>
      )}
      {isPending && !isReceiver && (
        <CardFooter>
          <p className="text-sm text-muted-foreground italic w-full text-center">Waiting for {otherUserName} to respond...</p>
        </CardFooter>
      )}
    </Card>
  );
};

export default function MySwapsPage() {
  const { user: authUser, loading: userLoading } = useUser();
  const firestore = useFirestore();

  const [swapRequests, setSwapRequests] = useState<EnrichedSwapRequest[]>([]);
  const [loadingSwaps, setLoadingSwaps] = useState(false);

  useEffect(() => {
    if (!authUser || !firestore) return;

    setLoadingSwaps(true);
    const swapsCol = collection(firestore, 'swaps');
    const q = query(
      swapsCol,
      or(
        where('senderId', '==', authUser.uid),
        where('receiverId', '==', authUser.uid)
      )
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const pendingSwaps = snapshot.docs.map(async (docData) => {
        const data = docData.data();
        const otherUserId = data.senderId === authUser.uid ? data.receiverId : data.senderId;

        let otherUser = undefined;
        try {
          const userRef = doc(firestore, 'users', otherUserId);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            otherUser = userSnap.data() as UserProfile;
          }
        } catch (e) { console.error('Error fetching foreign swap profile', e) }

        return {
          id: docData.id,
          ...data,
          otherUser
        } as EnrichedSwapRequest;
      });

      const enriched = await Promise.all(pendingSwaps);
      // Sort by creation date descending
      enriched.sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });

      setSwapRequests(enriched);
      setLoadingSwaps(false);
    }, (error) => {
      console.error("Error fetching swaps:", error);
      setLoadingSwaps(false);
    });

    return () => unsubscribe();
  }, [authUser, firestore]);

  const handleUpdateStatus = async (swapId: string, newStatus: string) => {
    try {
      const swap = swapRequests.find(s => s.id === swapId);
      if (newStatus === 'accepted' && swap) {
        // Create a chat automatically based on the accepted swap
        const chatsCol = collection(firestore, 'chats');
        await addDoc(chatsCol, {
          participants: [swap.senderId, swap.receiverId],
          updatedAt: new Date()
        });
      }

      const swapRef = doc(firestore, 'swaps', swapId);
      await updateDoc(swapRef, { status: newStatus, updatedAt: new Date() });
    } catch (err) {
      console.error("Error updating swap status:", err);
    }
  };

  const upcomingSwaps = swapRequests.filter(s => s.status === 'accepted');
  const pendingRequests = swapRequests.filter(s => s.status === 'pending');
  const pastSwaps = swapRequests.filter(s => s.status === 'completed' || s.status === 'declined');

  if (userLoading) {
    return <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!authUser) {
    return (
      <div className="text-center py-16 border rounded-lg bg-card">
        <h2 className="text-xl font-semibold mb-2">Please Log In</h2>
        <p className="text-muted-foreground">You need to be logged in to view your swaps.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight font-headline">My Swaps</h1>
        <p className="text-muted-foreground">Manage your skill exchange sessions and requests.</p>
      </div>
      <Tabs defaultValue="upcoming">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming
            {upcomingSwaps.length > 0 && <Badge variant="secondary" className="ml-2">{upcomingSwaps.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending
            {pendingRequests.length > 0 && <Badge variant="destructive" className="ml-2">{pendingRequests.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {loadingSwaps ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : upcomingSwaps.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSwaps.map(swap => <SwapCard key={swap.id} swap={swap} currentUserId={authUser?.uid || ''} onUpdateStatus={handleUpdateStatus} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Upcoming Swaps</h2>
              <p className="text-muted-foreground mt-2">You don't have any swaps scheduled.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending">
          {loadingSwaps ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : pendingRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map(swap => <SwapCard key={swap.id} swap={swap} currentUserId={authUser?.uid || ''} onUpdateStatus={handleUpdateStatus} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Pending Requests</h2>
              <p className="text-muted-foreground mt-2">You have no new swap requests.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history">
          {loadingSwaps ? (
            <div className="flex justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : pastSwaps.length > 0 ? (
            <div className="space-y-4">
              {pastSwaps.map(swap => <SwapCard key={swap.id} swap={swap} currentUserId={authUser?.uid || ''} onUpdateStatus={handleUpdateStatus} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Swap History</h2>
              <p className="text-muted-foreground mt-2">Your past swaps will appear here.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
