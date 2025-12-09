'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  Phone,
  TriangleAlert,
  Loader2,
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

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
import { Logo } from '@/components/logo';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth, useFirestore } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useLoader } from '@/context/loader-context';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response: any) => {},
        }
      );
    }
  }, [auth]);

  const checkPasswordStrength = (value: string) => {
    let strength = 0;
    if (value.length >= 8) strength += 1;
    if (value.match(/[a-z]/)) strength += 1;
    if (value.match(/[A-Z]/)) strength += 1;
    if (value.match(/[0-9]/)) strength += 1;
    if (value.match(/[^a-zA-Z0-9]/)) strength += 1;
    setPasswordStrength(strength);
    setPassword(value);
  };

  const createUserProfile = async (
    user: any,
    name: string,
    email: string | null,
    phone: string | null
  ) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);

    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        name: name || user.displayName,
        email: email || user.email,
        phone: phone || user.phoneNumber,
        avatarUrl:
          user.photoURL || `https://avatar.vercel.sh/${name || user.email}.png`,
        bio: '',
        location: '',
        skillsOffered: [],
        skillsNeeded: [],
      });
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName: name });
      await createUserProfile(userCredential.user, name, email, null);
      toast({
        title: 'Account Created!',
        description: 'Welcome to SkillSwap Hub.',
      });
      router.push('/browse');
    } catch (error: any) {
      hideLoader();
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists. Please log in.');
      } else if (error.code === 'auth/weak-password') {
        setError('The password is too weak. Please choose a stronger one.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      await createUserProfile(
        userCredential.user,
        userCredential.user.displayName!,
        userCredential.user.email,
        userCredential.user.phoneNumber
      );
      toast({
        title: 'Account Created!',
        description: 'Welcome to SkillSwap Hub.',
      });
      router.push('/browse');
    } catch (error: any) {
      hideLoader();
      if (error.code === 'auth/popup-closed-by-user') {
        setError('The sign-up window was closed. Please try again.');
      } else {
        setError('Could not sign up with Google. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const appVerifier = window.recaptchaVerifier!;
      const confirmationResult = await signInWithPhoneNumber(
        auth,
        `+${phone}`,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
      setOtpSent(true);
      toast({
        title: 'OTP Sent!',
        description: 'Check your phone for the verification code.',
      });
    } catch (error: any) {
      if (error.code === 'auth/invalid-phone-number') {
        setError('The phone number is not valid. Please include the country code.');
      } else {
        setError('Could not send OTP. Please check the number and try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions.');
      return;
    }
    setLoading(true);
    setError(null);
    showLoader();
    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;
      await updateProfile(user, { displayName: name });
      await createUserProfile(user, name, null, phone);
      toast({
        title: 'Account Created!',
        description: 'Welcome to SkillSwap Hub.',
      });
      router.push('/browse');
    } catch (error: any) {
      hideLoader();
      if (error.code === 'auth/invalid-verification-code') {
        setError('Invalid OTP. Please check the code and try again.');
      } else {
        setError('Could not verify OTP. Please try again.');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-headline">
              Create an Account
            </CardTitle>
            <CardDescription>
              Choose your preferred sign-up method
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Signup Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="email">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="phone">Phone</TabsTrigger>
              </TabsList>

              {/* EMAIL SIGNUP */}
              <TabsContent value="email">
                <form onSubmit={handleEmailSignup} className="grid gap-4 mt-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        placeholder="First Last"
                        className="pl-8"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
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
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="password"
                          type={passwordVisible ? 'text' : 'password'}
                          className="pl-8 pr-10"
                          onChange={(e) =>
                            checkPasswordStrength(e.target.value)
                          }
                          value={password}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {passwordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {password.length > 0 && (
                        <div className="space-y-1">
                          <Progress
                            value={passwordStrength * 20}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {passwordStrength < 3
                              ? 'Weak'
                              : passwordStrength < 5
                              ? 'Medium'
                              : 'Strong'}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={confirmPasswordVisible ? 'text' : 'password'}
                          className="pl-8 pr-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setConfirmPasswordVisible(!confirmPasswordVisible)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {confirmPasswordVisible ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading || !agreedToTerms}
                  >
                    {loading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Create Account
                  </Button>
                </form>
              </TabsContent>

              {/* PHONE SIGNUP */}
              <TabsContent value="phone">
                {!otpSent ? (
                  <form
                    onSubmit={handlePhoneSignup}
                    className="grid gap-4 mt-4"
                  >
                    <div className="grid gap-2">
                      <Label htmlFor="phone-name">Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone-name"
                          placeholder="First Last"
                          className="pl-8"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="2348012345678"
                          className="pl-8"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          disabled={loading}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Enter number with country code, e.g., 234 for Nigeria.
                      </p>
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {loading ? 'Sending OTP...' : 'Send OTP'}
                    </Button>
                  </form>
                ) : (
                  <form
                    onSubmit={handleOtpSubmit}
                    className="grid gap-4 mt-4"
                  >
                    <p className="text-sm text-center text-muted-foreground">
                      Enter the OTP sent to +{phone}
                    </p>
                    <div className="grid gap-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loading || !agreedToTerms}
                    >
                      {loading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Verify OTP & Sign Up
                    </Button>
                  </form>
                )}
              </TabsContent>

              <div className="flex items-center space-x-2 mt-6">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  disabled={loading}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-muted-foreground"
                >
                  I agree to the{' '}
                  <Link
                    href="/terms-of-service"
                    className="underline hover:text-primary"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy-policy"
                    className="underline hover:text-primary"
                  >
                    Privacy Policy
                  </Link>
                  .
                </Label>
              </div>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleGoogleSignup}
                disabled={loading || !agreedToTerms}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
                  <svg
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="mr-2 h-4 w-4"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    ></path>
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    ></path>
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    ></path>
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    ></path>
                    <path fill="none" d="M0 0h48v48H0z"></path>
                  </svg>
                )}
                Sign up with Google
              </Button>
            </Tabs>
          </CardContent>
        </Card>
        <div className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
