import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ComplaintPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">File a Complaint</h1>
          <p className="text-lg text-muted-foreground mb-8">
            If you've had an issue with another user or the platform, please let us know. We take all reports seriously.
          </p>
          <form className="space-y-6">
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
