"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, Phone, TriangleAlert } from "lucide-react";
import {
    getAuth,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithPhoneNumber,
    RecaptchaVerifier
} from "firebase/auth";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/firebase";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

declare global {
    interface Window {
        recaptchaVerifier?: RecaptchaVerifier;
        confirmationResult?: any;
    }
}

export default function LoginPage() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const auth = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const setupRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                'size': 'invisible',
                'callback': (response: any) => {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                }
            });
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/browse");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push("/browse");
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            setupRecaptcha();
            const appVerifier = window.recaptchaVerifier!;
            const confirmationResult = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
            window.confirmationResult = confirmationResult;
            setOtpSent(true);
            toast({ title: "OTP Sent!", description: "Check your phone for the verification code." });
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    }

    const handleOtpSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await window.confirmationResult.confirm(otp);
            router.push("/browse");
        } catch (error: any) {
             setError(error.message);
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div id="recaptcha-container"></div>
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <Card>
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                    <CardDescription>
                        Choose your preferred login method
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                         <Alert variant="destructive" className="mb-4">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>Login Failed</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                     <Tabs defaultValue="email">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="email">Email</TabsTrigger>
                            <TabsTrigger value="phone">Phone</TabsTrigger>
                        </TabsList>
                        <TabsContent value="email" className="grid gap-4 mt-4">
                            <form onSubmit={handleEmailLogin} className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="email" type="email" placeholder="m@example.com" className="pl-8" value={email} onChange={e => setEmail(e.target.value)} required/>
                                    </div>
                                </div>
                                 <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="/forgot-password" prefetch={false} className="ml-auto inline-block text-sm underline">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="password" type={passwordVisible ? "text" : "password"} className="pl-8 pr-10" value={password} onChange={e => setPassword(e.target.value)} required/>
                                        <button type="button" onClick={() => setPasswordVisible(!passwordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                            {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Logging in...' : 'Login'}
                                </Button>
                            </form>
                        </TabsContent>
                        <TabsContent value="phone" className="grid gap-4 mt-4">
                          {!otpSent ? (
                            <form onSubmit={handlePhoneLogin} className="grid gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input id="phone" type="tel" placeholder="15555555555" className="pl-8" value={phone} onChange={e => setPhone(e.target.value)} required />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Enter number with country code, e.g., 1 for US.</p>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Sending OTP...' : 'Send OTP'}
                                </Button>
                            </form>
                           ) : (
                             <form onSubmit={handleOtpSubmit} className="grid gap-4">
                               <div className="grid gap-2">
                                    <Label htmlFor="otp">Verification Code</Label>
                                    <Input id="otp" type="text" placeholder="Enter 6-digit code" value={otp} onChange={e => setOtp(e.target.value)} required/>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify OTP & Login'}
                                </Button>
                             </form>
                           )}
                        </TabsContent>
                        
                        <div className="relative mt-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                                </span>
                            </div>
                        </div>

                        <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={loading}>
                            {loading ? '...' : 'Login with Google'}
                        </Button>
                    </Tabs>
                </CardContent>
            </Card>
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="underline">
                Sign up
                </Link>
            </div>
        </div>
    </div>
  )
}
