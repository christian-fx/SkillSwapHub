"use client";

import { useState } from "react";
import Link from "next/link"
import { Eye, EyeOff, Lock, User, Mail, Phone } from "lucide-react";

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

export default function SignupPage() {
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const checkPasswordStrength = (value: string) => {
        let strength = 0;
        if (value.length >= 8) strength += 1;
        if (value.match(/[a-z]/)) strength += 1;
        if (value.match(/[A-Z]/)) strength += 1;
        if (value.match(/[0-9]/)) strength += 1;
        if (value.match(/[^a-zA-Z0-9]/)) strength += 1;
        setPasswordStrength(strength);
        setPassword(value);
    }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
             <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <Card>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
                    <CardDescription>
                        Choose your preferred sign-up method
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="email">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="name" placeholder="First Last" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="m@example.com" className="pl-8" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="phone" className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone-name">Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone-name" placeholder="First Last" className="pl-8" />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="phone" type="tel" placeholder="+1 (555) 555-5555" className="pl-8" />
                                </div>
                            </div>
                        </TabsContent>

                        <div className="grid gap-4 mt-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                 <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="password" 
                                        type={passwordVisible ? "text" : "password"} 
                                        className="pl-8 pr-10"
                                        onChange={(e) => checkPasswordStrength(e.target.value)}
                                        value={password}
                                    />
                                    <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {password.length > 0 && (
                                <div className="space-y-1">
                                    <Progress value={passwordStrength * 20} className="h-2" />
                                    <p className="text-xs text-muted-foreground">
                                        {passwordStrength < 3 ? "Weak" : passwordStrength < 5 ? "Medium" : "Strong"}
                                    </p>
                                </div>
                                )}
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                 <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input id="confirm-password" type={confirmPasswordVisible ? "text" : "password"} className="pl-8 pr-10" />
                                     <button type="button" onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        {confirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-6">
                            <Checkbox id="terms" />
                            <Label htmlFor="terms" className="text-sm text-muted-foreground">
                                I agree to the{" "}
                                <Link href="/terms-of-service" className="underline hover:text-primary">
                                Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link href="/privacy-policy" className="underline hover:text-primary">
                                Privacy Policy
                                </Link>.
                            </Label>
                        </div>
                        
                        <Button type="submit" className="w-full mt-6" asChild>
                            <Link href="/browse">Create Account</Link>
                        </Button>
                        <Button variant="outline" className="w-full mt-2">
                            Sign up with Google
                        </Button>
                    </Tabs>
                </CardContent>
            </Card>
            <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline">
                Login
                </Link>
            </div>
        </div>
    </div>
  )
}
