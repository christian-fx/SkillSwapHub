import Link from "next/link"

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

export default function SignupPage() {
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
                    Enter your information to create an account
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="First Last" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/browse">Create Account</Link>
                </Button>
                 <Button variant="outline" className="w-full">
                    Sign up with Google
                </Button>
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
