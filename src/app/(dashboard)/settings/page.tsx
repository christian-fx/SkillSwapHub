import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight font-headline">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>
            <Separator />

            <Card>
                <CardHeader>
                    <CardTitle>Account</CardTitle>
                    <CardDescription>Update your account information.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Alice Johnson" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="alice@example.com" />
                    </div>
                    <Button>Update Account</Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>Change your password here. After saving, you'll be logged out.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                    </div>
                    <Button>Save Password</Button>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="new-message-notifications">New Messages</Label>
                            <p className="text-sm text-muted-foreground">Receive an email when you get a new message.</p>
                        </div>
                        <Switch id="new-message-notifications" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="swap-proposal-notifications">Swap Proposals</Label>
                            <p className="text-sm text-muted-foreground">Receive an email for new skill swap proposals.</p>
                        </div>
                        <Switch id="swap-proposal-notifications" defaultChecked />
                    </div>
                     <div className="flex items-center justify-between">
                        <div>
                            <Label htmlFor="suggestion-notifications">AI Suggestions</Label>
                            <p className="text-sm text-muted-foreground">Get notified about new AI-powered suggestions.</p>
                        </div>
                        <Switch id="suggestion-notifications" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
