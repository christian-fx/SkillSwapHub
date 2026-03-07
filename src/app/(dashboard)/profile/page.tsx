
'use client';

import { useState, useEffect, useCallback } from 'react';
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
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Trash2, Zap, ArrowRight, Edit, Save, X, Loader2, BadgeCheck, ShieldCheck, TrendingUp, Star, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ALL_SKILLS } from '@/lib/skills';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { suggestSkillSwaps, type SkillSwapOutput } from '@/ai/flows/skill-match-suggestions';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';


type UserProfile = {
  uid: string;
  name: string;
  email: string;
  location: string;
  phone?: string;
  gender?: string;
  bio: string;
  avatarUrl: string;
  skillsOffered: string[];
  skillsNeeded: string[];
  isVerified?: boolean;
  status?: 'online' | 'offline';
};

const SkillManager = ({
  title,
  description,
  userSkills,
  onAdd,
  onRemove,
  isEditing,
  setIsEditing
}: {
  title: string;
  description: string;
  userSkills: string[];
  onAdd: (skill: string) => void;
  onRemove: (skill: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
}) => {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Done" : "Edit Skills"}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <>
            <p className="text-sm font-medium">Your Skills</p>
            <div className="space-y-2 min-h-[6rem] rounded-md border p-2">
              {userSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button onClick={() => onRemove(skill)} className="rounded-full hover:bg-background/50">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-2">No skills added yet.</p>
              )}
            </div>
            <p className="text-sm font-medium">Available Skills</p>
            <ScrollArea className="h-64 rounded-md border">
              <div className="p-4 space-y-2">
                {ALL_SKILLS.map((skill) => {
                  const isAdded = userSkills.includes(skill);
                  if (isAdded) return null;
                  return (
                    <div key={skill} className="flex items-center justify-between">
                      <span className="text-sm">{skill}</span>
                      <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => onAdd(skill)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </>
        ) : (
          <div className="space-y-2 min-h-[6rem] rounded-md border p-2">
            {userSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground p-2">No skills added yet. Click 'Edit Skills' to add some.</p>
            )}
          </div>
        )}

      </CardContent>
    </Card>
  );
};


export default function ProfilePage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const auth = useAuth();
  const { toast } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingOffered, setIsEditingOffered] = useState(false);
  const [isEditingNeeded, setIsEditingNeeded] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    bio: '',
    phone: '',
    gender: '',
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [aiSuggestions, setAiSuggestions] = useState<SkillSwapOutput>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const verificationBenefits = [
    { icon: ShieldCheck, text: "Increased trust from other users" },
    { icon: TrendingUp, text: "Higher visibility in search results" },
    { icon: Star, text: "Exclusive access to premium features" },
  ];

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
            status: 'online', // Default to online for demo
          });
          setFormData({
            name: data.name || '',
            location: data.location || '',
            bio: data.bio || '',
            phone: data.phone || '',
            gender: data.gender || 'Prefer not to say',
          });
          setAvatarPreview(data.avatarUrl || null);
        }
        setLoading(false);
      };
      fetchProfile();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, firestore, userLoading]);

  const getSuggestions = useCallback(async () => {
    if (!profile || (profile.skillsOffered.length === 0 && profile.skillsNeeded.length === 0)) {
      setAiSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const suggestions = await suggestSkillSwaps({
        skillsOffered: profile.skillsOffered,
        skillsNeeded: profile.skillsNeeded,
      });
      setAiSuggestions(suggestions);
    } catch (error) {
      console.error("Error fetching AI suggestions:", error);
      toast({
        variant: "destructive",
        title: "AI Suggestion Error",
        description: "Could not fetch AI-powered suggestions at this time. Please try again later."
      });
    } finally {
      setSuggestionsLoading(false);
    }
  }, [profile, toast]);

  useEffect(() => {
    if (activeTab === 'suggestions') {
      getSuggestions();
    }
  }, [activeTab, getSuggestions, profile?.skillsOffered, profile?.skillsNeeded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenderChange = (val: string) => {
    setFormData(prev => ({ ...prev, gender: val }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const processAvatarUpload = async (): Promise<string | null> => {
    if (!avatarFile) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(avatarFile);
    });
  };

  const handleSaveChanges = async () => {
    if (!user || !profile) return;
    setLoading(true);

    let finalAvatarUrl = profile.avatarUrl;
    if (avatarFile) {
      const url = await processAvatarUpload();
      if (url) finalAvatarUrl = url;
    }

    const userDocRef = doc(firestore, 'users', user.uid);
    const updatedProfileData = {
      ...profile,
      name: formData.name,
      location: formData.location,
      bio: formData.bio,
      phone: formData.phone,
      gender: formData.gender,
      avatarUrl: finalAvatarUrl,
    }

    try {
      await setDoc(userDocRef, updatedProfileData, { merge: true });

      // Update Auth Profile if changed
      if (auth.currentUser) {
        const updates: any = {};
        if (auth.currentUser.displayName !== formData.name) updates.displayName = formData.name;
        if (avatarFile) updates.photoURL = finalAvatarUrl;

        if (Object.keys(updates).length > 0) {
          await updateProfile(auth.currentUser, updates);
        }
      }

      setProfile(updatedProfileData);
      setIsEditingProfile(false);
      setAvatarFile(null); // Clear file after successful save
      toast({
        title: "Profile Updated",
        description: "Your changes have been saved successfully."
      });
    } catch (error) {
      console.error("Error updating profile: ", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your profile changes. Please try again."
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSkillUpdate = async (skillType: 'skillsOffered' | 'skillsNeeded', newSkills: string[]) => {
    if (!user || !profile) return;

    const userDocRef = doc(firestore, 'users', user.uid);
    try {
      await updateDoc(userDocRef, {
        [skillType]: newSkills
      });
      setProfile(prev => prev ? ({ ...prev, [skillType]: newSkills }) : null);
      toast({
        title: "Skills Updated",
        description: "Your skills have been saved."
      });
    } catch (error) {
      console.error("Error updating skills:", error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your skill changes. Please try again."
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
    setIsEditingProfile(false);
  }


  if (loading || userLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (!user || !profile) {
    return <div className="text-center p-8">
      <h2 className="text-xl font-semibold">Profile Not Found</h2>
      <p className="text-muted-foreground">Please log in to view and edit your profile.</p>
    </div>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarPreview || profile.avatarUrl} alt={profile.name} />
            <AvatarFallback>
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          {isEditingProfile ? (
            <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
              <Upload className="h-6 w-6 text-white mb-1" />
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleAvatarChange}
              />
            </div>
          ) : (
            <div className={cn("absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-background", profile.status === 'online' ? 'bg-green-500' : 'bg-gray-400')} />
          )}

        </div>
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-2">
            {profile.name}
            {profile.isVerified && <BadgeCheck className="h-7 w-7 text-primary" />}
          </h1>
          <p className="text-muted-foreground">{profile.location}</p>
        </div>
      </div>
      <Tabs defaultValue="profile" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="skills">Manage Skills</TabsTrigger>
          <TabsTrigger value="suggestions">AI Suggestions</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="grid gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Profile Details</CardTitle>
                  <CardDescription>
                    {isEditingProfile ? "Update your personal information." : "View your personal information."}
                  </CardDescription>
                </div>
                {!isEditingProfile ? (
                  <Button variant="outline" size="icon" onClick={() => setIsEditingProfile(true)}>
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
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    {isEditingProfile ? (
                      <Input id="name" value={formData.name} onChange={handleInputChange} />
                    ) : (
                      <p className="text-sm p-2 bg-muted/50 rounded-md">{profile.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <p className="text-sm p-2 bg-muted/50 rounded-md text-muted-foreground">{profile.email}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditingProfile ? (
                      <Input id="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="Phone number" />
                    ) : (
                      <p className="text-sm p-2 bg-muted/50 rounded-md">{profile.phone || "Not set"}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditingProfile ? (
                      <Select value={formData.gender} onValueChange={handleGenderChange}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                          <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-sm p-2 bg-muted/50 rounded-md">{profile.gender || "Prefer not to say"}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  {isEditingProfile ? (
                    <Input id="location" value={formData.location} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm p-2 bg-muted/50 rounded-md">{profile.location || 'Not set'}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  {isEditingProfile ? (
                    <Textarea id="bio" value={formData.bio} onChange={handleInputChange} />
                  ) : (
                    <p className="text-sm p-2 whitespace-pre-wrap">{profile.bio || "No bio yet."}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {!profile.isVerified && (
              <Card>
                <CardHeader>
                  <CardTitle>Get Verified</CardTitle>
                  <CardDescription>Stand out in the community and unlock new benefits.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {verificationBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-3">
                        <benefit.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm">{benefit.text}</span>
                      </li>
                    ))}
                  </ul>
                  <Button>Get Verified Now</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        <TabsContent value="skills">
          <div className="grid md:grid-cols-2 gap-6">
            <SkillManager
              title="Skills I Offer"
              description="What are you good at?"
              userSkills={profile.skillsOffered || []}
              onAdd={(skill) => addSkill('skillsOffered', skill)}
              onRemove={(skill) => removeSkill('skillsOffered', skill)}
              isEditing={isEditingOffered}
              setIsEditing={setIsEditingOffered}
            />
            <SkillManager
              title="Skills I Need"
              description="What do you want to learn?"
              userSkills={profile.skillsNeeded || []}
              onAdd={(skill) => addSkill('skillsNeeded', skill)}
              onRemove={(skill) => removeSkill('skillsNeeded', skill)}
              isEditing={isEditingNeeded}
              setIsEditing={setIsEditingNeeded}
            />
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
                Here are some potential skill swaps we found for you based on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {suggestionsLoading ? (
                <div className="flex items-center justify-center p-8 gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <p>Finding the best matches for you...</p>
                </div>
              ) : aiSuggestions.length > 0 ? (
                aiSuggestions.map((suggestion, index) => (
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
                <div className="text-center p-8">
                  <p>
                    No suggestions available right now.
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Try adding skills you offer and need to get personalized matches!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
