'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, SlidersHorizontal, ArrowRight, X, ArrowDownAZ, ArrowUpZA, Plus, Zap, Loader2 } from 'lucide-react';

import { users as allUsers } from '@/lib/data';
import type { User, UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { recommendUsers } from '@/ai/flows/recommend-users';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const USERS_PER_PAGE = 8;

type RecommendationType = "bestMatches" | "needsMySkills" | "offersMyNeeds" | "none";

export default function BrowsePage() {
  const { user: authUser, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'random' | 'asc' | 'desc'>('random');
  const [aiRecommendation, setAiRecommendation] = useState<RecommendationType>('none');
  const [recommendedUserIds, setRecommendedUserIds] = useState<string[] | null>(null);
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const [currentUserProfile, setCurrentUserProfile] = useState<UserProfile | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  // Drawer-specific temporary states
  const [drawerSearch, setDrawerSearch] = useState('');
  const [drawerSort, setDrawerSort] = useState<'random' | 'asc' | 'desc'>('random');
  const [drawerAiRecommendation, setDrawerAiRecommendation] = useState<RecommendationType>('none');

  useEffect(() => {
    if (authUser && firestore) {
      const fetchProfile = async () => {
        const userDocRef = doc(firestore, 'users', authUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setCurrentUserProfile(userDoc.data() as UserProfile);
        }
      };
      fetchProfile();
    }
  }, [authUser, firestore]);

  const shuffledUsers = useMemo(() => {
    return [...allUsers].sort(() => Math.random() - 0.5);
  }, []);

  const sortedAndFilteredUsers = useMemo(() => {
    let users: User[] = [];
    
    if (aiRecommendation !== 'none' && recommendedUserIds) {
      const userMap = new Map(allUsers.map(u => [u.id, u]));
      users = recommendedUserIds.map(id => userMap.get(id)).filter((u): u is User => !!u);
    } else {
      users = sortOrder === 'random' ? shuffledUsers : [...allUsers];
    }
    
    if (sortOrder === 'asc') {
      users.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      users.sort((a, b) => b.name.localeCompare(a.name));
    }

    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      users = users.filter(user =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        (user.skillsOffered && user.skillsOffered.some(skill => skill.toLowerCase().includes(lowercasedQuery))) ||
        (user.skillsNeeded && user.skillsNeeded.some(skill => skill.toLowerCase().includes(lowercasedQuery)))
      );
    }
    
    return users;
  }, [searchQuery, sortOrder, shuffledUsers, aiRecommendation, recommendedUserIds]);


  const totalPages = Math.ceil(sortedAndFilteredUsers.length / USERS_PER_PAGE);
  const paginatedUsers = sortedAndFilteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setDrawerSearch("");
    setSortOrder("random");
    setDrawerSort("random");
    setAiRecommendation("none");
    setDrawerAiRecommendation("none");
    setRecommendedUserIds(null);
    setCurrentPage(1);
  }, []);

  const applyFilters = async () => {
    setSearchQuery(drawerSearch);
    setSortOrder(drawerSort);
    setAiRecommendation(drawerAiRecommendation);
    setCurrentPage(1);
    
    if (drawerAiRecommendation !== 'none') {
        if (!currentUserProfile) {
            toast({
                variant: 'destructive',
                title: "Profile Not Found",
                description: "Could not fetch your profile for AI recommendations. Please complete your profile and try again."
            })
            return;
        }
        setRecommendationLoading(true);
        try {
            const result = await recommendUsers({
                currentUser: {
                    skillsOffered: currentUserProfile.skillsOffered || [],
                    skillsNeeded: currentUserProfile.skillsNeeded || [],
                },
                recommendationType: drawerAiRecommendation,
            });
            setRecommendedUserIds(result.recommendedUserIds);
        } catch (error) {
            console.error("Error fetching AI recommendations:", error);
            toast({
                variant: "destructive",
                title: "AI Recommendation Error",
                description: "Could not fetch AI recommendations at this time. Please try again later."
            });
            setRecommendedUserIds([]);
        } finally {
            setRecommendationLoading(false);
        }

    } else {
        setRecommendedUserIds(null);
    }
  }

  const handleDrawerOpen = (open: boolean) => {
    if (open) {
      setDrawerSearch(searchQuery);
      setDrawerSort(sortOrder);
      setDrawerAiRecommendation(aiRecommendation);
    }
    setIsDrawerOpen(open);
  }
  
  const hasActiveFilters = searchQuery !== '' || sortOrder !== 'random' || aiRecommendation !== 'none';
  
  const getRecommendationLabel = (value: RecommendationType) => {
    switch (value) {
      case 'bestMatches': return 'Best matches for me';
      case 'needsMySkills': return 'People who need my skills';
      case 'offersMyNeeds': return 'People offering what I need';
      default: return null;
    }
  }

  if (userLoading) {
      return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-headline">
            Discover Skills
          </h1>
          <p className="text-muted-foreground">
            Browse profiles to find your next skill swap.
          </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
           <Drawer open={isDrawerOpen} onOpenChange={handleDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filter & Sort
              </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mx-auto w-full max-w-sm">
                <DrawerHeader>
                    <DrawerTitle>Sort & Filter</DrawerTitle>
                    <DrawerDescription>Adjust how you view the profiles.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-4">
                    <Input
                        placeholder="Search skills or people..."
                        value={drawerSearch}
                        onChange={(e) => setDrawerSearch(e.target.value)}
                    />
                  
                  <Separator />

                  <div>
                     <Label className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Zap className="h-4 w-4 text-primary" /> AI Recommendations
                    </Label>
                    <Select value={drawerAiRecommendation} onValueChange={(v) => setDrawerAiRecommendation(v as RecommendationType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a recommendation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="bestMatches">Best matches for me</SelectItem>
                            <SelectItem value="needsMySkills">People who need my skills</SelectItem>
                            <SelectItem value="offersMyNeeds">People offering what I need</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <Separator />

                  <div>
                    <Label className="text-sm font-medium">Sort by Name</Label>
                    <RadioGroup value={drawerSort} onValueChange={(value) => setDrawerSort(value as 'random' | 'asc' | 'desc')}>
                        <div className="flex items-center space-x-2 mt-2">
                            <RadioGroupItem value="asc" id="r-asc" />
                            <Label htmlFor="r-asc" className="flex items-center gap-2"><ArrowDownAZ className="h-4 w-4"/> Ascending</Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <RadioGroupItem value="desc" id="r-desc" />
                            <Label htmlFor="r-desc" className="flex items-center gap-2"><ArrowUpZA className="h-4 w-4"/> Descending</Label>
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                            <RadioGroupItem value="random" id="r-random" />
                            <Label htmlFor="r-random">Default</Label>
                        </div>
                    </RadioGroup>
                  </div>
                </div>
                <DrawerFooter>
                    <Button onClick={() => { applyFilters(); setIsDrawerOpen(false); }}>Apply</Button>
                    {hasActiveFilters && (
                       <Button variant="ghost" onClick={() => { clearFilters(); setIsDrawerOpen(false); }}>Clear Filters</Button>
                    )}
                </DrawerFooter>
                </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      
       {hasActiveFilters && (
        <div className="flex items-center gap-2 text-sm mt-4">
          <h3 className="font-semibold">Active Filters:</h3>
          <div className="flex flex-wrap gap-1">
            {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
            {sortOrder !== 'random' && <Badge variant="secondary">Sort: {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}</Badge>}
            {aiRecommendation !== 'none' && <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                {getRecommendationLabel(aiRecommendation)}
            </Badge>}
            <Button variant="ghost" size="icon" className="h-5 w-5" onClick={clearFilters}><X className="h-4 w-4" /></Button>
          </div>
        </div>
      )}

      {recommendationLoading ? (
        <div className="text-center py-16">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-lg font-semibold">Finding recommendations for you...</p>
            <p className="text-muted-foreground">The AI is analyzing profiles to find the best matches.</p>
        </div>
      ) : (
      <>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-4">
            {paginatedUsers.map((user) => (
            <Card key={user.id} className="flex flex-col">
                <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                    <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle>{user.name}</CardTitle>
                    <CardDescription>{user.location}</CardDescription>
                </div>
                </CardHeader>
                <CardContent className="flex-grow">
                <div>
                    <h3 className="text-sm font-semibold mb-2">Offers:</h3>
                    <div className="flex flex-wrap gap-1">
                    {user.skillsOffered.map((skill) => (
                        <Badge key={skill} variant="secondary">
                        {skill}
                        </Badge>
                    ))}
                    </div>
                </div>
                <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Needs:</h3>
                    <div className="flex flex-wrap gap-1">
                    {user.skillsNeeded.map((skill) => (
                        <Badge key={skill} variant="outline">
                        {skill}
                        </Badge>
                    ))}
                    </div>
                </div>
                </CardContent>
                <CardFooter>
                <Dialog>
                    <DialogTrigger asChild>
                    <Button className="w-full">
                        Propose Swap <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    </DialogTrigger>
                    <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Propose a Swap with {user.name}</DialogTitle>
                        <DialogDescription>
                        Let them know what you'd like to exchange.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                        <Label htmlFor="message">Your Message</Label>
                        <Textarea id="message" placeholder={`Hi ${user.name}, I'd love to learn...`} />
                        </div>
                    </div>
                    <Button>Send Proposal</Button>
                    </DialogContent>
                </Dialog>
                </CardFooter>
            </Card>
            ))}
        </div>

        {totalPages > 1 && (
            <div className="flex items-center justify-center pt-8">
                <div className="flex items-center gap-2">
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-1 text-sm">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <Button 
                                key={page}
                                variant={currentPage === page ? "default" : "ghost"}
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>
                    <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Button>
                </div>
            </div>
        )}

        {paginatedUsers.length === 0 && (
            <div className="text-center py-16">
                <p className="text-lg font-semibold">No users found</p>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
                {hasActiveFilters && (
                    <Button variant="link" onClick={clearFilters} className="mt-4">
                        Clear all filters
                    </Button>
                )}
            </div>
        )}
       </>
      )}
    </>
  );
}
