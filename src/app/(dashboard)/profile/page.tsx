'use client';

import { useState, useEffect, useMemo } from 'react';
import { useUser, useFirestore, useAuth } from '@/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Trash2, Zap, ArrowRight, Edit, Save, X, Check, ChevronsUpDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ALL_SKILLS } from '@/lib/skills';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { cn } from '@/lib/utils';


// This is a placeholder, in a real app you might fetch these dynamically
const initialSuggestions = [
    {
        suggestedSkill: 'Public Speaking',
        offeredBy: 'Fiona G.',
        matchReason: 'A great match for your goal to learn presentation skills.',
    },
    {
        suggestedSkill: 'React',
        offeredBy: 'Bob W.',
        matchReason: 'You both want to improve your web development abilities.',
    }
];


type UserProfile = {
  uid: string;
  name: string;
  email: string;
  location: string;
  bio: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsNeeded: string[];
};

const SkillCombobox = ({
    selectedSkills,
    onSelect,
    availableSkills
}: {
    selectedSkills: string[],
    onSelect: (skill: string) => void,
    availableSkills: string[]
}) => {
    const [open, setOpen] = useState(false);
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    Add a skill...
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput placeholder="Search for a skill..." />
                    <CommandList>
                        <CommandEmpty>No skill found.</CommandEmpty>
                        <CommandGroup>
                            {availableSkills.map((skill) => (
                                <CommandItem
                                    key={skill}
                                    value={skill}
                                    onSelect={(currentValue) => {
                                        const skillToAdd = ALL_SKILLS.find(s => s.toLowerCase() === currentValue);
                                        if (skillToAdd) {
                                            onSelect(skillToAdd);
                                        }
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            selectedSkills.includes(skill) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {skill}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', location: '', bio: '' });

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoading(true);
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const data = userDoc.data() as UserProfile;
          setProfile({
              ...data,
              skillsOffered: data.skillsOffered || [],
              skillsNeeded: data.skillsNeeded || [],
          });
          setFormData({
              name: data.name || '',
              location: data.location || '',
              bio: data.bio || '',
          })
        }
        setLoading(false);
      };
      fetchProfile();
    } else if (!userLoading) {
        setLoading(false);
    }
  }, [user, firestore, userLoading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({...prev, [id]: value}));
  }

  const handleSaveChanges = async () => {
    if (!user || !profile) return;

    const userDocRef = doc(firestore, 'users', user.uid);
    const updatedProfileData = {
        ...profile,
        name: formData.name,
        location: formData.location,
        bio: formData.bio,
    }

    try {
        await setDoc(userDocRef, updatedProfileData, { merge: true });
        if (auth.currentUser && auth.currentUser.displayName !== formData.name) {
            await updateProfile(auth.currentUser, { displayName: formData.name });
        }
        setProfile(updatedProfileData);
        setIsEditing(false);
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully."
        });
    } catch (error) {
        console.error("Error updating profile: ", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update your profile. Please try again."
        });
    }
  }
  
  const handleSkillUpdate = async (skillType: 'skillsOffered' | 'skillsNeeded', newSkills: string[]) => {
      if (!user || !profile) return;
      
      const userDocRef = doc(firestore, 'users', user.uid);
      try {
          await updateDoc(userDocRef, {
              [skillType]: newSkills
          });
          setProfile(prev => prev ? ({...prev, [skillType]: newSkills}) : null);
          toast({
              title: "Skills Updated",
              description: "Your skills have been saved."
          });
      } catch (error) {
          console.error("Error updating skills:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update your skills. Please try again."
        });
      }
  }

  const addSkill = (skillType: 'skillsOffered' | 'skillsNeeded', skill: string) => {
      if (!profile) return;
      const currentSkills = profile[skillType] || [];
      if (!currentSkills.includes(skill)) {
          const newSkills = [...currentSkills, skill];
          handleSkillUpdate(skillType, newSkills);
      }
  }

  const removeSkill = (skillType: 'skillsOffered' | 'skillsNeeded', skill: string) => {
      if (!profile) return;
      const currentSkills = profile[skillType] || [];
      const newSkills = currentSkills.filter(s => s !== skill);
      handleSkillUpdate(skillType, newSkills);
  }

  const handleCancelEdit = () => {
    if (profile) {
        setFormData({
            name: profile.name || '',
            location: profile.location || '',
            bio: profile.bio || '',
        });
    }
    setIsEditing(false);
  }
  
  const availableSkillsOffered = useMemo(() => {
    if (!profile) return ALL_SKILLS;
    return ALL_SKILLS.filter(skill => !(profile.skillsOffered || []).includes(skill));
  }, [profile]);
  
  const availableSkillsNeeded = useMemo(() => {
    if (!profile) return ALL_SKILLS;
    return ALL_SKILLS.filter(skill => !(profile.skillsNeeded || []).includes(skill));
  }, [profile]);

  if (loading || userLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user || !profile) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profile.avatarUrl} alt={profile.name} />
          <AvatarFallback>
            {profile.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold font-headline">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.location}</p>
        </div>
      </div>
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="skills">Manage Skills</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  {isEditing ? "Update your personal information." : "View your personal information."}
                </CardDescription>
              </div>
               {!isEditing ? (
                    <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
                        <Edit className="h-4 w-4" />
                    </Button>
                ) : (
                    <div className="flex gap-2">
                        <Button size="icon" onClick={handleSaveChanges}>
                            <Save className="h-4 w-4" />
                        </Button>
                         <Button variant="ghost" size="icon" onClick={handleCancelEdit}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                 {isEditing ? (
                    <Input id="name" value={formData.name} onChange={handleInputChange} />
                ) : (
                    <p className="text-sm p-2">{profile.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <p className="text-sm p-2 text-muted-foreground">{profile.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                {isEditing ? (
                    <Input id="location" value={formData.location} onChange={handleInputChange} />
                ) : (
                    <p className="text-sm p-2">{profile.location}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                 {isEditing ? (
                    <Textarea id="bio" value={formData.bio} onChange={handleInputChange} />
                ) : (
                    <p className="text-sm p-2 whitespace-pre-wrap">{profile.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="skills">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skills I Offer</CardTitle>
                <CardDescription>What are you good at?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 min-h-[6rem]">
                  {(profile.skillsOffered || []).map((skill) => (
                    <div
                      key={skill}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary"
                    >
                      <span>{skill}</span>
                      <Button size="icon" variant="ghost" onClick={() => removeSkill('skillsOffered', skill)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <SkillCombobox 
                    selectedSkills={profile.skillsOffered || []}
                    onSelect={(skill) => addSkill('skillsOffered', skill)}
                    availableSkills={availableSkillsOffered}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skills I Need</CardTitle>
                <CardDescription>What do you want to learn?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 min-h-[6rem]">
                  {(profile.skillsNeeded || []).map((skill) => (
                     <div
                      key={skill}
                      className="flex items-center justify-between p-2 rounded-md bg-secondary"
                    >
                      <span>{skill}</span>
                      <Button size="icon" variant="ghost" onClick={() => removeSkill('skillsNeeded', skill)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                 <SkillCombobox 
                    selectedSkills={profile.skillsNeeded || []}
                    onSelect={(skill) => addSkill('skillsNeeded', skill)}
                    availableSkills={availableSkillsNeeded}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="suggestions">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>AI-Powered Suggestions</CardTitle>
              </div>
              <CardDescription>
                Here are some potential skill swaps we found for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {initialSuggestions.length > 0 ? (
                initialSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge>{suggestion.suggestedSkill}</Badge>
                          <span className="text-sm">offered by</span>
                          <span className="font-semibold">
                            {suggestion.offeredBy}
                          </span>
                        </div>
                        <p className="text-muted-foreground mt-2">
                          {suggestion.matchReason}
                        </p>
                      </div>
                      <Button variant="secondary">
                        Propose Swap <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <p>
                  No suggestions available right now. Try adding more skills
                  you need!
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
