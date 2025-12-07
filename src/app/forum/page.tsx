import Link from "next/link";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import { Button } from "@/components/ui/button";

export default function ForumPage() {
    const forumThreads = [
        { title: "Looking for a pottery partner in NYC!", user: users[0], replies: 5, lastReply: "2 hours ago" },
        { title: "Tips for beginners in React?", user: users[1], replies: 12, lastReply: "5 hours ago" },
        { title: "Showcase: My first woodworking project", user: users[4], replies: 8, lastReply: "1 day ago" },
    ];
  return (
    <div className="flex flex-col min-h-dvh">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto">
            <Button asChild>
                <Link href="/login">Back to App</Link>
            </Button>
        </nav>
      </header>
      <main className="flex-1">
        <div className="container px-4 md:px-6 py-12 md:py-20 lg:py-28">
          <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Community Forum
                </h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                    Ask questions, share your projects, and connect with the community.
                </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12 space-y-4">
            {forumThreads.map((thread, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent cursor-pointer">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={thread.user.avatarUrl} alt={thread.user.name} data-ai-hint={thread.user.avatarHint} />
                        <AvatarFallback>{thread.user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{thread.title}</p>
                        <p className="text-sm text-muted-foreground">by {thread.user.name}</p>
                    </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                    <p>{thread.replies} replies</p>
                    <p>{thread.lastReply}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
