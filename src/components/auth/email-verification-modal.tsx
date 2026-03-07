'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/firebase';
import { sendEmailVerification, reload } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function EmailVerificationModal() {
    const { user } = useUser();
    const [isOpen, setIsOpen] = useState(false);
    const [hasDismissed, setHasDismissed] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const { toast } = useToast();
    const pathname = usePathname();

    useEffect(() => {
        // Check if user is logged in, uses password auth (not google), and is unverified.
        // Provider ID for email/password is 'password'.
        const isEmailAuth = user?.providerData.some((p) => p.providerId === 'password');
        if (user && isEmailAuth && !user.emailVerified && !hasDismissed) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [user, user?.emailVerified, hasDismissed]);

    const handleResend = async () => {
        if (!user) return;
        setIsResending(true);
        try {
            await sendEmailVerification(user);
            toast({
                title: 'Verification Email Sent',
                description: 'Please check your inbox and spam folder.',
            });
        } catch (error: any) {
            console.error(error);
            if (error.code === 'auth/too-many-requests') {
                toast({
                    variant: 'destructive',
                    title: 'Too many requests',
                    description: 'We already sent an email recently. Please wait a bit.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: 'Could not send verification email. Try again later.',
                });
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleCheckVerified = async () => {
        if (!user) return;
        setIsChecking(true);
        try {
            await reload(user);
            if (user.emailVerified) {
                setIsOpen(false);
                toast({
                    title: 'Email Verified!',
                    description: 'Thank you! You now have full access to chats and swaps.',
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Not Verified Yet',
                    description: 'We could not verify your email. Please check your inbox or spam.',
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsChecking(false);
        }
    };

    if (!user) return null;

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="mx-auto bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                        <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Verify your email address</DialogTitle>
                    <DialogDescription className="text-center pt-2">
                        We sent a verification link to <strong>{user.email}</strong>.
                        You need to verify your email to unlock Swaps and Messaging.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    <Alert variant="default" className="bg-amber-500/10 text-amber-500 border-amber-500/20">
                        <AlertTriangle className="h-4 w-4" color="#f59e0b" />
                        <AlertTitle>Didn't receive it?</AlertTitle>
                        <AlertDescription>
                            Check your <strong>Spam</strong> or <strong>Promotions</strong> folder. It might have ended up there!
                        </AlertDescription>
                    </Alert>

                    <Button onClick={handleCheckVerified} disabled={isChecking} className="w-full">
                        {isChecking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        I have verified my email
                    </Button>

                    <Button variant="outline" onClick={handleResend} disabled={isResending} className="w-full">
                        {isResending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Resend Verification Email
                    </Button>

                    <div className="text-center text-sm text-muted-foreground mt-2">
                        Wrong email? <a href="/profile" onClick={() => setIsOpen(false)} className="underline hover:text-primary">Update in Profile</a>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
