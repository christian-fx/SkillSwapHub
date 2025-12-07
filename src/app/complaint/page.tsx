import Link from "next/link";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ComplaintPage() {
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto">
            <Button asChild>
                <Link href="/browse">Back to App</Link>
            </Button>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 md:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                File a Complaint
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                If you've had an issue with another user or the platform, please let us know. We take all reports seriously.
            </p>
          </div>
          <form className="max-w-xl mx-auto mt-12 space-y-6">
             <div className="space-y-2">
                <Label htmlFor="username">Your Username</Label>
                <Input id="username" placeholder="e.g., alice_j" />
            </div>
             <div className="space-y-2">
                <Label htmlFor="offending-user">Username of person you are reporting (if applicable)</Label>
                <Input id="offending-user" placeholder="e.g., bob_w" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="A brief summary of the issue" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="description">Description of Incident</Label>
                <Textarea id="description" placeholder="Please provide as much detail as possible, including dates, times, and a description of what happened." rows={8} />
            </div>
            <Button type="submit" variant="destructive">Submit Report</Button>
          </form>
        </div>
      </main>
    </div>
  );
}
