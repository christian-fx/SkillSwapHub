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

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
            <div className="flex justify-center mb-6">
                <Logo />
            </div>
            <Card>
                <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
                <CardDescription>
                    Enter your email below to login to your account
                </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link href="#" className="ml-auto inline-block text-sm underline">
                        Forgot your password?
                    </Link>
                    </div>
                    <Input id="password" type="password" />
                </div>
                <Button type="submit" className="w-full" asChild>
                    <Link href="/browse">Login</Link>
                </Button>
                <Button variant="outline" className="w-full">
                    Login with Google
                </Button>
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
