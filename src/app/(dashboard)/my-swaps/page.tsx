'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { SwapRequest, UserProfile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRightLeft, Calendar, Check, Clock, X, Loader2, Star } from 'lucide-react';
import { format } from 'date-fns';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, onSnapshot, or, doc, getDoc, updateDoc, addDoc, arrayUnion } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from 'lucide-react';

export type EnrichedSwapRequest = SwapRequest & {
  otherUser?: UserProfile;
};

// DECLINE DIALOG COMPONENT
const DeclineDialog = ({ swapId, onDecline }: { swapId: string, onDecline: (id: string, reason: string) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reasonCategory, setReasonCategory] = useState("User does not offer what I need");
  const [customReason, setCustomReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDecline = async () => {
    setIsSubmitting(true);
    let finalReason = reasonCategory;
    if (reasonCategory === "Other" && customReason.trim()) {
      finalReason = customReason.trim();
    }
    await onDecline(swapId, finalReason);
    setIsSubmitting(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-destructive hover:bg-destructive/10">
          <X className="h-4 w-4 mr-2" />
          Decline
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Decline Swap Request</DialogTitle>
          <DialogDescription>
            Please let the other person know why you are declining this request.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Reason</Label>
            <Select value={reasonCategory} onValueChange={setReasonCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="User does not offer what I need">User does not offer what I need</SelectItem>
                <SelectItem value="Feels suspicious/Spam">Feels suspicious/Spam</SelectItem>
                <SelectItem value="Found a swap already">Found a swap already</SelectItem>
                <SelectItem value="Schedule doesn't align">Schedule doesn't align</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {reasonCategory === "Other" && (
            <div className="grid gap-2">
              <Label>Specify Details</Label>
              <Textarea
                placeholder="Briefly explain..."
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleConfirmDecline} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Confirm Decline
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SwapCard = ({ swap, currentUserId, onUpdateStatus }: { swap: EnrichedSwapRequest, currentUserId: string, onUpdateStatus: (id: string, status: string, reason?: string) => void }) => {
  const isPending = swap.status === 'pending';
  const isCompleted = swap.status === 'completed';
  const isDeclined = swap.status === 'declined';
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
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Swap with {otherUserName}</span>
              {isDeclined && <Badge variant="destructive" className="ml-2">Declined</Badge>}
            </CardTitle>
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

        {isDeclined && swap.declineReason && !isReceiver && (
          <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" />
            <div className="text-sm text-destructive font-medium">
              <span className="opacity-80">Reason: </span>
              {swap.declineReason}
            </div>
          </div>
        )}
      </CardContent>
      {isPending && isReceiver && (
        <CardFooter className="gap-2">
          <Button className="w-full flex-1" onClick={() => onUpdateStatus(swap.id, 'accepted')}>
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <div className="flex-1">
            <DeclineDialog swapId={swap.id} onDecline={(id, reason) => onUpdateStatus(id, 'declined', reason)} />
          </div>
        </CardFooter>
      )}
      {isPending && !isReceiver && (
        <CardFooter>
          <p className="text-sm text-muted-foreground italic w-full text-center">Waiting for {otherUserName} to respond...</p>
        </CardFooter>
      )}
      {isUpcoming && (
        <CardFooter>
          {swap.completedBy?.includes(currentUserId) ? (
            <p className="text-sm text-muted-foreground italic w-full text-center">Waiting for {otherUserName} to confirm completion...</p>
          ) : (
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => onUpdateStatus(swap.id, 'mark_completed')}>
              <Check className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

// REVIEW DIALOG COMPONENT
const ReviewDialog = ({ swap, currentUserId }: { swap: EnrichedSwapRequest, currentUserId: string }) => {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetUserId = swap.senderId === currentUserId ? swap.receiverId : swap.senderId;
  const targetUserName = swap.otherUser?.name || 'User';

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Rating Required", description: "Please provide a star rating.", variant: "destructive" });
      return;
    }
    if (!firestore || !currentUserId) return;
    setIsSubmitting(true);

    try {
      // 1. Save the review
      const reviewsCol = collection(firestore, 'reviews');
      await addDoc(reviewsCol, {
        swapId: swap.id,
        reviewerId: currentUserId,
        targetUserId: targetUserId,
        rating: rating,
        comment: comment,
        createdAt: new Date()
      });

      // 2. Update the swap so we don't prompt again
      const swapRef = doc(firestore, 'swaps', swap.id);
      await updateDoc(swapRef, {
        reviewedBy: arrayUnion(currentUserId)
      });

      // 3. Update the target user's average rating 
      // Note: In production, cloud functions should recalc this defensively to prevent client-side spoofing, 
      // but we do a simple client read+average here for the demo flow.
      const targetUserRef = doc(firestore, 'users', targetUserId);
      const targetUserSnap = await getDoc(targetUserRef);
      if (targetUserSnap.exists()) {
        const userData = targetUserSnap.data();
        const currentAvg = userData.rating || 0;
        const currentCount = userData.reviewCount || 0;

        const newCount = currentCount + 1;
        const newAvg = ((currentAvg * currentCount) + rating) / newCount;

        await updateDoc(targetUserRef, {
          rating: newAvg,
          reviewCount: newCount
        });
      }

      toast({ title: "Review Submitted", description: `Thank you for reviewing ${targetUserName}!` });
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to submit review.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/10">
          <Star className="h-4 w-4 mr-2" />
          Leave a Review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review your Swap</DialogTitle>
          <DialogDescription>
            How was your skill exchange with {targetUserName}?
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "h-8 w-8 cursor-pointer transition-colors",
                  rating >= star ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-200"
                )}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
          <div className="grid gap-2">
            <Label>Comments (Optional)</Label>
            <Textarea
              placeholder="What did you learn? How was their communication?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};


export default function MySwapsPage() {
  const { user: authUser, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

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

  const handleUpdateStatus = async (swapId: string, newStatus: string, declineReason?: string) => {
    try {
      if (!authUser) return;

      if (newStatus === 'accepted') {
        const isEmailAuth = authUser.providerData.some((p) => p.providerId === 'password');
        if (isEmailAuth && !authUser.emailVerified) {
          toast({ title: "Email Not Verified", description: "You must verify your email address to accept swaps.", variant: "destructive" });
          return;
        }
      }

      const swap = swapRequests.find(s => s.id === swapId);
      if (!swap) return;

      const swapRef = doc(firestore, 'swaps', swapId);

      if (newStatus === 'mark_completed') {
        // Mutual Confirmation Logic
        const updatedCompletedBy = [...(swap.completedBy || []), authUser.uid];

        if (updatedCompletedBy.length >= 2) {
          // Both have confirmed -> actually mark status completed
          await updateDoc(swapRef, {
            completedBy: arrayUnion(authUser.uid),
            status: 'completed',
            updatedAt: new Date()
          });
          toast({ title: "Swap Completed!", description: "Both parties have confirmed the swap." });
        } else {
          // Only one has confirmed
          await updateDoc(swapRef, {
            completedBy: arrayUnion(authUser.uid),
            updatedAt: new Date()
          });
          toast({ title: "Confirmation Sent", description: "Waiting for the other user to confirm." });
        }
      } else {
        // Standard Accept/Decline
        const updates: any = {
          status: newStatus,
          updatedAt: new Date(),
          read: false // Mark unread for the notification system to trigger for sender
        };

        if (newStatus === 'declined' && declineReason) {
          updates.declineReason = declineReason;
        }

        if (newStatus === 'accepted') {
          // Create a chat automatically based on the accepted swap
          const chatsCol = collection(firestore, 'chats');
          await addDoc(chatsCol, {
            participants: [swap.senderId, swap.receiverId],
            updatedAt: new Date()
          });
          toast({ title: "Swap Accepted!", description: "A new chat has been created." });
        }
        await updateDoc(swapRef, updates);
      }
    } catch (err) {
      console.error("Error updating swap status:", err);
      toast({ title: "Error", description: "Failed to update swap status.", variant: "destructive" });
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
              {pastSwaps.map(swap => (
                <div key={swap.id}>
                  <SwapCard swap={swap} currentUserId={authUser?.uid || ''} onUpdateStatus={handleUpdateStatus} />
                  {swap.status === 'completed' && !swap.reviewedBy?.includes(authUser?.uid || '') && (
                    <ReviewDialog swap={swap} currentUserId={authUser?.uid || ''} />
                  )}
                </div>
              ))}
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
