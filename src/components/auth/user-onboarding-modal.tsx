'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, X, Loader2, Sparkles } from 'lucide-react';
import { ALL_SKILLS } from '@/lib/skills';
import { useToast } from '@/hooks/use-toast';

export function UserOnboardingModal() {
    const { user } = useUser();
    const firestore = useFirestore();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const [skillsOffered, setSkillsOffered] = useState<string[]>([]);
    const [skillsNeeded, setSkillsNeeded] = useState<string[]>([]);

    const [searchOffered, setSearchOffered] = useState('');
    const [searchNeeded, setSearchNeeded] = useState('');

    const { toast } = useToast();

    useEffect(() => {
        if (!user || !firestore) {
            setIsLoading(false);
            return;
        }

        const fetchProfile = async () => {
            try {
                const docRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const offered = data.skillsOffered || [];
                    const needed = data.skillsNeeded || [];

                    if (offered.length < 2 || needed.length < 1) {
                        setSkillsOffered(offered);
                        setSkillsNeeded(needed);
                        setIsOpen(true);
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile for onboarding:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [user, firestore]);

    const handleSave = async () => {
        if (!user || !firestore) return;
        if (skillsOffered.length < 2 || skillsNeeded.length < 1) return;

        setIsSaving(true);
        try {
            const docRef = doc(firestore, 'users', user.uid);
            await updateDoc(docRef, {
                skillsOffered,
                skillsNeeded
            });
            setIsOpen(false);
            toast({
                title: "Welcome to SkillSwap!",
                description: "Your profile is set up. Start exploring matches!",
            });
        } catch (error) {
            console.error("Error saving skills:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Could not save your skills. Please try again."
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading || !user) return null;

    const offeredValid = skillsOffered.length >= 2;
    const neededValid = skillsNeeded.length >= 1;
    const canSubmit = offeredValid && neededValid;

    return (
        <Dialog open={isOpen}>
            {/* Using onInteractOutside to prevent clicking away */}
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col pt-8" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" /> Welcome to SkillSwap</DialogTitle>
                    <DialogDescription>
                        To get the best matches, tell us what you can teach and what you want to learn.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 pr-4 -mr-4">
                    <div className="space-y-6 py-4 px-1">
                        {/* Offered Section */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-sm flex items-center justify-between">
                                    <span>Skills I Offer</span>
                                    <span className={offeredValid ? "text-green-500 text-xs" : "text-destructive text-xs"}>(Min {Math.max(0, 2 - skillsOffered.length)} more)</span>
                                </h4>
                                <p className="text-xs text-muted-foreground">What are you good at?</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillsOffered.map(skill => (
                                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                        {skill}
                                        <button onClick={() => setSkillsOffered(prev => prev.filter(s => s !== skill))} className="rounded-full hover:bg-background/50">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search skills to offer..." className="pl-8" value={searchOffered} onChange={(e) => setSearchOffered(e.target.value)} />
                            </div>
                            {searchOffered && (
                                <div className="bg-muted/50 border rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
                                    {ALL_SKILLS.filter(s => s.toLowerCase().includes(searchOffered.toLowerCase()) && !skillsOffered.includes(s)).slice(0, 5).map(skill => (
                                        <Button key={skill} variant="ghost" size="sm" className="w-full justify-start h-8" onClick={() => { setSkillsOffered(prev => [...prev, skill]); setSearchOffered(''); }}>
                                            <Plus className="h-4 w-4 mr-2" /> {skill}
                                        </Button>
                                    ))}
                                    {ALL_SKILLS.filter(s => s.toLowerCase().includes(searchOffered.toLowerCase()) && !skillsOffered.includes(s)).length === 0 && (
                                        <p className="text-xs text-center text-muted-foreground py-2">No matching skills found.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Needed Section */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="font-medium text-sm flex items-center justify-between">
                                    <span>Skills I Need</span>
                                    <span className={neededValid ? "text-green-500 text-xs" : "text-destructive text-xs"}>(Min {Math.max(0, 1 - skillsNeeded.length)} more)</span>
                                </h4>
                                <p className="text-xs text-muted-foreground">What do you want to learn?</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {skillsNeeded.map(skill => (
                                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                                        {skill}
                                        <button onClick={() => setSkillsNeeded(prev => prev.filter(s => s !== skill))} className="rounded-full hover:bg-background/50">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search skills to learn..." className="pl-8" value={searchNeeded} onChange={(e) => setSearchNeeded(e.target.value)} />
                            </div>
                            {searchNeeded && (
                                <div className="bg-muted/50 border rounded-md p-2 max-h-40 overflow-y-auto space-y-1">
                                    {ALL_SKILLS.filter(s => s.toLowerCase().includes(searchNeeded.toLowerCase()) && !skillsNeeded.includes(s)).slice(0, 5).map(skill => (
                                        <Button key={skill} variant="ghost" size="sm" className="w-full justify-start h-8" onClick={() => { setSkillsNeeded(prev => [...prev, skill]); setSearchNeeded(''); }}>
                                            <Plus className="h-4 w-4 mr-2" /> {skill}
                                        </Button>
                                    ))}
                                    {ALL_SKILLS.filter(s => s.toLowerCase().includes(searchNeeded.toLowerCase()) && !skillsNeeded.includes(s)).length === 0 && (
                                        <p className="text-xs text-center text-muted-foreground py-2">No matching skills found.</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="pt-4 mt-2">
                    <Button className="w-full" disabled={!canSubmit || isSaving} onClick={handleSave}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Complete Setup
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
