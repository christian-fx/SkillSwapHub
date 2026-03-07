'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  TriangleAlert,
  Loader2,
  Upload,
} from 'lucide-react';
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  sendEmailVerification,
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
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth, useFirestore } from '@/firebase';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  const createUserProfile = async (
    user: any,
    name: string,
    email: string | null,
    genderVal: string,
    avatarUrlVal: string | null
  ) => {
    if (!firestore) return;
    const userRef = doc(firestore, 'users', user.uid);

    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      const safeName = name || user.displayName || 'Anonymous';
      const safeEmail = email || user.email || null;
      let finalAvatarUrl = avatarUrlVal || user.photoURL || `https://avatar.vercel.sh/${safeName.replace(/[^a-zA-Z0-9]/g, '')}.png`;

      await setDoc(userRef, {
        uid: user.uid,
        name: safeName,
        email: safeEmail,
        phone: null,
        gender: genderVal || 'Prefer not to say',
        avatarUrl: finalAvatarUrl,
        bio: '',
        location: '',
        skillsOffered: [],
        skillsNeeded: [],
      });
    }
  };

  const processAvatarUpload = async (userId: string): Promise<string | null> => {
    // Basic implementation placeholder - in a real app, upload to Firebase Storage
    // Because Firebase Storage is not fully configured here, we'll convert to base64 for now
    // or use the vercel avatar fallback if no file is provided.
    // For small demo images, base64 is okay, but Storage is better long term.
    if (!avatarFile) return null;
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(avatarFile);
    });
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
    if (!gender) {
      setError('Please select a gender.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      let finalAvatarUrl = null;
      if (avatarFile) {
        finalAvatarUrl = await processAvatarUpload(userCredential.user.uid);
      }

      try {
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: finalAvatarUrl || ''
        });
      } catch (profileError) {
        console.warn('updateProfile failed (non-critical):', profileError);
      }

      await createUserProfile(userCredential.user, name, email, gender, finalAvatarUrl);

      // Send the verification email immediately
      try {
        await sendEmailVerification(userCredential.user);
      } catch (verifyError) {
        console.error('Failed to send verification email:', verifyError);
      }

      toast({
        title: 'Account Created!',
        description: 'Welcome to SkillSwap Hub.',
      });
      router.push('/browse');
    } catch (error: any) {
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
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);

      try {
        await createUserProfile(
          userCredential.user,
          userCredential.user.displayName || '',
          userCredential.user.email,
          'Prefer not to say', // Google doesn't easily provide gender in basic scope
          userCredential.user.photoURL
        );
      } catch (profileError) {
        console.warn("Failed to create user profile in Firestore:", profileError);
      }
      toast({
        title: 'Account Created!',
        description: 'Welcome to SkillSwap Hub.',
      });
      router.push('/browse');
    } catch (error: any) {
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

  return (
    <div className="flex items-center justify-center min-h-screen p-4 py-8">
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
              Join the community to start swapping skills
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

            <form onSubmit={handleEmailSignup} className="grid gap-4 mt-2">
              <div className="flex flex-col items-center justify-center gap-2 mb-2">
                <div className="relative h-20 w-20 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center overflow-hidden bg-muted">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar Preview" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-8 w-8 text-muted-foreground/50" />
                  )}
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Upload className="h-5 w-5 text-white mb-1" />
                    <span className="text-[10px] text-white font-medium">Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Profile Image (Optional)</p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
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

              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select disabled={loading} value={gender} onValueChange={setGender} required>
                  <SelectTrigger id="gender" className="w-full">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
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
                className="w-full mt-2"
                disabled={loading || !agreedToTerms}
              >
                {loading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Account
              </Button>
            </form>

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
