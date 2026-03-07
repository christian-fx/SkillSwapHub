'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { SwapRequest } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ArrowRightLeft, Calendar, Check, Clock, X, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useUser } from '@/firebase';

const SwapCard = ({ swap }: { swap: SwapRequest }) => {
  const isPending = swap.status === 'pending';
  const isCompleted = swap.status === 'completed';
  const isUpcoming = swap.status === 'accepted';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={swap.user.avatarUrl} alt={swap.user.name} data-ai-hint={swap.user.avatarHint} />
            <AvatarFallback>{swap.user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">Swap with {swap.user.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm mt-1">
              {isUpcoming || isCompleted ? <Calendar className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
              {format(new Date(swap.date), isCompleted ? 'PPP' : 'PPP p')}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-center p-2 rounded-md bg-secondary/50 flex-1">
            <p className="text-xs text-muted-foreground">You Offered</p>
            <p className="font-semibold">{swap.offeredSkill}</p>
          </div>
          <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
          <div className="text-center p-2 rounded-md bg-secondary/50 flex-1">
            <p className="text-xs text-muted-foreground">You Requested</p>
            <p className="font-semibold">{swap.requestedSkill}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-4 p-3 bg-secondary/30 rounded-md border">"{swap.message}"</p>
      </CardContent>
      {isPending && (
        <CardFooter className="gap-2">
          <Button className="w-full">
            <Check className="h-4 w-4 mr-2" />
            Accept
          </Button>
          <Button variant="outline" className="w-full">
            <X className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function MySwapsPage() {
  const { user: authUser, loading: userLoading } = useUser();

  // Using empty arrays temporarily until Phase 3 firestore hooks are added
  const upcomingSwaps: SwapRequest[] = [];
  const pendingRequests: SwapRequest[] = [];
  const pastSwaps: SwapRequest[] = [];

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
          {upcomingSwaps.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingSwaps.map(swap => <SwapCard key={swap.id} swap={swap} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Upcoming Swaps</h2>
              <p className="text-muted-foreground mt-2">You don't have any swaps scheduled.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="pending">
          {pendingRequests.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingRequests.map(swap => <SwapCard key={swap.id} swap={swap} />)}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-card">
              <h2 className="text-xl font-semibold">No Pending Requests</h2>
              <p className="text-muted-foreground mt-2">You have no new swap requests.</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="history">
          {pastSwaps.length > 0 ? (
            <div className="space-y-4">
              {pastSwaps.map(swap => <SwapCard key={swap.id} swap={swap} />)}
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
