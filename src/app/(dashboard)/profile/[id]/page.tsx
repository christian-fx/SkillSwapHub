'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, BadgeCheck, Loader2, Star } from 'lucide-react';

import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, collection, addDoc } from 'firebase/firestore';
import type { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import React from 'react';

export default function PublicProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { user: authUser, loading: authLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [swapMessage, setSwapMessage] = useState('');
  const [isProposing, setIsProposing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (!resolvedParams?.id || !firestore) return;

    const fetchProfile = async () => {
      setLoading(true);
      try {
        // If they click on their own profile, maybe redirect them to the editable profile page
        if (authUser && authUser.uid === resolvedParams.id) {
          router.push('/profile');
          return;
        }

        const docRef = doc(firestore, 'users', resolvedParams.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile({
            uid: docSnap.id,
            name: data.name || 'Anonymous',
            email: data.email || '',
            location: data.location || 'Unknown',
            bio: data.bio || '',
            avatarUrl: data.avatarUrl || `https://avatar.vercel.sh/${docSnap.id}.png`,
            skillsOffered: data.skillsOffered || [],
            skillsNeeded: data.skillsNeeded || [],
            isVerified: data.isVerified || false,
            rating: data.rating || 0,
            status: data.status || 'offline',
          } as any);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [firestore, resolvedParams?.id, authUser, router]);

  const handleProposeSwap = async () => {
    if (!authUser || !profile) {
      toast({ title: "Not logged in", description: "You must be logged in to propose a swap.", variant: "destructive" });
      return;
    }

    const isEmailAuth = authUser.providerData.some((p) => p.providerId === 'password');
    if (isEmailAuth && !authUser.emailVerified) {
      toast({ title: "Email Not Verified", description: "You must verify your email address before proposing swaps.", variant: "destructive" });
      return;
    }

    setIsProposing(true);
    try {
      const swapsCol = collection(firestore, 'swaps');
      await addDoc(swapsCol, {
        senderId: authUser.uid,
        receiverId: profile.uid,
        status: 'pending',
        message: swapMessage,
        createdAt: new Date(),
        updatedAt: new Date(),
        read: false
      });
      toast({ title: "Swap Proposed", description: `Your proposal to ${profile.name} was sent!` });
      setSwapMessage('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error proposing swap:", error);
      toast({ title: "Error", description: "Could not send proposal.", variant: "destructive" });
    } finally {
      setIsProposing(false);
    }
  };

  if (loading || authLoading || !resolvedParams) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">User Not Found</h1>
        <p className="text-muted-foreground mb-6">The profile you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/browse')}>Back to Browse</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>

      <div className="md:grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center mb-4 relative mx-auto w-32 h-32">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatarUrl} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="text-4xl">{profile.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className={cn("absolute bottom-2 right-2 h-6 w-6 rounded-full border-4 border-background", profile.status === 'online' ? 'bg-green-500' : 'bg-gray-400')} />
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                {profile.name}
                {profile.isVerified && <BadgeCheck className="h-6 w-6 text-primary" />}
              </CardTitle>
              <CardDescription className="text-sm mt-1">{profile.location}</CardDescription>
              {/* @ts-ignore - rating added informally */}
              {(profile as any).rating > 0 && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  {/* @ts-ignore */}
                  <span className="font-semibold text-lg">{Number((profile as any).rating).toFixed(1)}</span>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full mt-4" size="lg">Propose Swap</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Propose a Swap with {profile.name}</DialogTitle>
                    <DialogDescription>
                      Share what you want to learn and what you can teach in return.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea
                        id="message"
                        placeholder={`Hi ${profile.name}, I'm interested in learning from you...`}
                        value={swapMessage}
                        onChange={(e) => setSwapMessage(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  <Button onClick={handleProposeSwap} disabled={isProposing || swapMessage.trim() === ''}>
                    {isProposing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send Proposal'}
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6 mt-6 md:mt-0">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="whitespace-pre-wrap leading-relaxed text-muted-foreground">{profile.bio || "This user hasn't written a bio yet."}</p>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Skills Offered</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsOffered.length > 0 ? (
                    profile.skillsOffered.map(skill => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1 text-sm">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None listed.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t">
                <h3 className="font-semibold mb-3">Skills Needed</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skillsNeeded.length > 0 ? (
                    profile.skillsNeeded.map(skill => (
                      <Badge key={skill} variant="outline" className="px-3 py-1 text-sm">{skill}</Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">None listed.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
