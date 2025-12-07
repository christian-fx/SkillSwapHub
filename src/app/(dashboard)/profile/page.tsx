import { suggestSkillSwaps, type SkillSwapInput } from "@/ai/flows/skill-match-suggestions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { users } from "@/lib/data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Trash2, Zap, ArrowRight } from "lucide-react";

// This would typically come from a database based on the logged-in user
const currentUser = users[0];

export default async function ProfilePage() {
  const skillSwapInput: SkillSwapInput = {
    skillsOffered: currentUser.skillsOffered.map(s => s.name),
    skillsNeeded: currentUser.skillsNeeded.map(s => s.name),
  };
  const suggestions = await suggestSkillSwaps(skillSwapInput);

  return (
    <div className="grid gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-24 w-24">
            <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} data-ai-hint={currentUser.avatarHint} />
            <AvatarFallback>{currentUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
            <h1 className="text-3xl font-bold font-headline">{currentUser.name}</h1>
            <p className="text-muted-foreground">{currentUser.location}</p>
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
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Update your personal information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={currentUser.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={currentUser.email} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" defaultValue={currentUser.location} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" defaultValue={currentUser.bio} />
              </div>
              <Button>Save Changes</Button>
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
                        <div className="space-y-2">
                            {currentUser.skillsOffered.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                    <span>{skill.name}</span>
                                    <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Add a new skill..." />
                            <Button size="icon"><Plus className="h-4 w-4"/></Button>
                        </div>
                    </CardContent>
                 </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Skills I Need</CardTitle>
                        <CardDescription>What do you want to learn?</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                         <div className="space-y-2">
                            {currentUser.skillsNeeded.map(skill => (
                                <div key={skill.id} className="flex items-center justify-between p-2 rounded-md bg-secondary">
                                    <span>{skill.name}</span>
                                    <Button size="icon" variant="ghost"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Add a new skill..." />
                            <Button size="icon"><Plus className="h-4 w-4"/></Button>
                        </div>
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
                    <CardDescription>Here are some potential skill swaps we found for you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {suggestions.length > 0 ? (
                        suggestions.map((suggestion, index) => (
                           <Card key={index} className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <Badge>{suggestion.suggestedSkill}</Badge>
                                            <span className="text-sm">offered by</span>
                                            <span className="font-semibold">{suggestion.offeredBy}</span>
                                        </div>
                                        <p className="text-muted-foreground mt-2">{suggestion.matchReason}</p>
                                    </div>
                                    <Button variant="secondary">Propose Swap <ArrowRight className="h-4 w-4 ml-2" /></Button>
                                </div>
                           </Card>
                        ))
                    ) : (
                        <p>No suggestions available right now. Try adding more skills you need!</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
