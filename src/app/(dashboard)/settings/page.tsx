'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { useUser, useFirestore, useAuth } from "@/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail, deleteUser } from "firebase/auth";
import type { UserProfile } from "@/lib/types";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
    const { user: authUser } = useUser();
    const firestore = useFirestore();
    const auth = useAuth();
    const { theme, setTheme } = useTheme();
    const { toast } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [preferences, setPreferences] = useState<UserProfile['preferences']>({
        notifications: { newMessages: true, swapProposals: true, aiSuggestions: false },
        privacy: { profileVisible: true, readReceipts: true },
        display: { theme: 'system' }
    });

    useEffect(() => {
        if (!authUser || !firestore) return;

        const loadPreferences = async () => {
            try {
                const userDoc = await getDoc(doc(firestore, 'users', authUser.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data() as UserProfile;
                    if (data.preferences) {
                        setPreferences(prev => ({
                            notifications: { 
                                newMessages: data.preferences?.notifications?.newMessages ?? prev?.notifications?.newMessages ?? true,
                                swapProposals: data.preferences?.notifications?.swapProposals ?? prev?.notifications?.swapProposals ?? true,
                                aiSuggestions: data.preferences?.notifications?.aiSuggestions ?? prev?.notifications?.aiSuggestions ?? false,
                            },
                            privacy: { 
                                profileVisible: data.preferences?.privacy?.profileVisible ?? prev?.privacy?.profileVisible ?? true,
                                readReceipts: data.preferences?.privacy?.readReceipts ?? prev?.privacy?.readReceipts ?? true,
                            },
                            display: { 
                                theme: data.preferences?.display?.theme ?? prev?.display?.theme ?? 'system' 
                            }
                        }) as any);
                        if (data.preferences.display?.theme) {
                            setTheme(data.preferences.display.theme);
                        }
                    }
                }
            } catch (error) {
                console.error("Error loading preferences:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadPreferences();
    }, [authUser, firestore, setTheme]);

    const handleSave = async (newPrefs: UserProfile['preferences']) => {
        if (!authUser || !firestore) return;
        setIsSaving(true);
        try {
            await updateDoc(doc(firestore, 'users', authUser.uid), {
                preferences: newPrefs
            });
            setPreferences(newPrefs);
            toast({ title: "Settings saved", description: "Your preferences have been updated successfully." });
        } catch (error) {
            console.error("Error saving preferences:", error);
            toast({ title: "Error", description: "Failed to save settings. Please try again.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const updateNotificationPreference = (key: string, value: boolean) => {
        const newPrefs = {
            ...preferences,
            notifications: { ...preferences?.notifications, [key]: value } as any
        };
        handleSave(newPrefs);
    };

    const updatePrivacyPreference = (key: string, value: boolean) => {
        const newPrefs = {
            ...preferences,
            privacy: { ...preferences?.privacy, [key]: value } as any
        };
        handleSave(newPrefs);
    };

    const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
        setTheme(value);
        const newPrefs = {
            ...preferences,
            display: { theme: value }
        };
        handleSave(newPrefs);
    };

    const handleResetPassword = async () => {
        if (!authUser?.email) return;
        try {
            await sendPasswordResetEmail(auth!, authUser.email);
            toast({ title: "Email Sent", description: "Password reset email has been sent. Please check your inbox." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to send reset email.", variant: "destructive" });
        }
    };

    const handleDeleteAccount = async () => {
        if (!auth?.currentUser) return;
        try {
            await deleteUser(auth.currentUser);
            toast({ title: "Account Deleted", description: "Your account has been successfully deleted." });
            router.push('/login');
        } catch (error: any) {
            toast({ 
                title: "Error deleting account", 
                description: "You may need to log out and log back in to verify your identity before deleting your account.", 
                variant: "destructive" 
            });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-muted-foreground">Loading settings...</div>;
    }

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <Separator />
            
            <div className="grid gap-6">
                {/* NOTIFICATIONS TIER */}
                <Card>
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Manage how you receive alerts and emails.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="new-message-notifications" className="text-base">New Messages</Label>
                                <p className="text-sm text-muted-foreground">Receive an alert when you get a new chat message.</p>
                            </div>
                            <Switch 
                                id="new-message-notifications" 
                                checked={preferences?.notifications?.newMessages} 
                                onCheckedChange={(c) => updateNotificationPreference('newMessages', c)}
                                disabled={isSaving}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="swap-proposal-notifications" className="text-base">Swap Proposals</Label>
                                <p className="text-sm text-muted-foreground">Get notified when someone requests a skill swap.</p>
                            </div>
                            <Switch 
                                id="swap-proposal-notifications" 
                                checked={preferences?.notifications?.swapProposals} 
                                onCheckedChange={(c) => updateNotificationPreference('swapProposals', c)}
                                disabled={isSaving}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="suggestion-notifications" className="text-base">AI Suggestions</Label>
                                <p className="text-sm text-muted-foreground">Receive occasional AI-powered match recommendations.</p>
                            </div>
                            <Switch 
                                id="suggestion-notifications" 
                                checked={preferences?.notifications?.aiSuggestions}
                                onCheckedChange={(c) => updateNotificationPreference('aiSuggestions', c)}
                                disabled={isSaving}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* PRIVACY & VISIBILITY TIER */}
                <Card>
                    <CardHeader>
                        <CardTitle>Privacy & Visibility</CardTitle>
                        <CardDescription>Control who can see your profile and activity.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="profile-visible" className="text-base">Public Profile</Label>
                                <p className="text-sm text-muted-foreground">Allow your profile to appear in Browse and AI searches.</p>
                            </div>
                            <Switch 
                                id="profile-visible" 
                                checked={preferences?.privacy?.profileVisible} 
                                onCheckedChange={(c) => updatePrivacyPreference('profileVisible', c)}
                                disabled={isSaving}
                            />
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="read-receipts" className="text-base">Read Receipts</Label>
                                <p className="text-sm text-muted-foreground">Let others know when you have read their messages.</p>
                            </div>
                            <Switch 
                                id="read-receipts" 
                                checked={preferences?.privacy?.readReceipts} 
                                onCheckedChange={(c) => updatePrivacyPreference('readReceipts', c)}
                                disabled={isSaving}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* DISPLAY PREFERENCES TIER */}
                <Card>
                    <CardHeader>
                        <CardTitle>Display Preferences</CardTitle>
                        <CardDescription>Customize the look and feel of the application.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <RadioGroup 
                            value={theme || 'system'} 
                            onValueChange={handleThemeChange}
                            className="space-y-3"
                            disabled={isSaving}
                        >
                            <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer" onClick={() => handleThemeChange('light')}>
                                <RadioGroupItem value="light" id="theme-light" />
                                <Label htmlFor="theme-light" className="cursor-pointer flex-1">Light Mode</Label>
                            </div>
                            <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer" onClick={() => handleThemeChange('dark')}>
                                <RadioGroupItem value="dark" id="theme-dark" />
                                <Label htmlFor="theme-dark" className="cursor-pointer flex-1">Dark Mode</Label>
                            </div>
                            <div className="flex items-center space-x-3 border rounded-lg p-3 hover:bg-accent cursor-pointer" onClick={() => handleThemeChange('system')}>
                                <RadioGroupItem value="system" id="theme-system" />
                                <Label htmlFor="theme-system" className="cursor-pointer flex-1">System Default</Label>
                            </div>
                        </RadioGroup>
                    </CardContent>
                </Card>

                {/* DANGER ZONE - ACCOUNT MANAGEMENT */}
                <Card className="border-destructive/50">
                    <CardHeader>
                        <CardTitle className="text-destructive">Account Management</CardTitle>
                        <CardDescription>Securely manage your credentials or permanently remove your account.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-medium">Password Reset</p>
                                <p className="text-sm text-muted-foreground">Send a secure link to your email to reset your password.</p>
                            </div>
                            <Button variant="outline" onClick={handleResetPassword}>Send Reset Email</Button>
                        </div>
                        <Separator />
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="font-medium text-destructive">Delete Account</p>
                                <p className="text-sm text-muted-foreground">Permanently remove your account and all data. This action is irreversible.</p>
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive">Delete Account</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone. This will permanently delete your
                                            account and remove your data from our servers.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                            Yes, delete my account
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
