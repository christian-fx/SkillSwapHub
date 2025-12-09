"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";
import { useAuth } from "@/firebase";
import { useToast } from "@/hooks/use-toast";
import { Mail, TriangleAlert, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState(false);

    const auth = useAuth();
    const { toast } = useToast();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await sendPasswordResetEmail(auth, email);
            setEmailSent(true);
            toast({
                title: "Password Reset Email Sent",
                description: "Check your inbox for instructions to reset your password.",
            });
        } catch (error: any) {
            if (error.code === 'auth/user-not-found') {
                setError("No account found with this email address.");
            } else {
                setError("An error occurred. Please try again.");
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <Card>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-headline">Forgot Password</CardTitle>
                    {!emailSent ? (
                        <CardDescription>
                            Enter your email to receive a password reset link.
                        </CardDescription>
                    ) : (
                         <CardDescription>
                            If an account exists for {email}, you will receive an email with reset instructions.
                        </CardDescription>
                    )}
                </CardHeader>
                <CardContent>
                    {error && (
                         <Alert variant="destructive" className="mb-4">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {!emailSent ? (
                        <form onSubmit={handleResetPassword} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input 
                                        id="email" 
                                        type="email" 
                                        placeholder="m@example.com" 
                                        className="pl-8" 
                                        value={email} 
                                        onChange={e => setEmail(e.target.value)} 
                                        required
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <p className="text-muted-foreground">You can close this window.</p>
                        </div>
                    )}
                     <div className="mt-4 text-center text-sm">
                        Remember your password?{" "}
                        <Link href="/login" className="underline">
                            Login
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
