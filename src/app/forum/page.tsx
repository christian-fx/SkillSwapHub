import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";

export default function ForumPage() {
    const forumThreads = [
        { title: "Looking for a pottery partner in NYC!", user: users[0], replies: 5, lastReply: "2 hours ago" },
        { title: "Tips for beginners in React?", user: users[1], replies: 12, lastReply: "5 hours ago" },
        { title: "Showcase: My first woodworking project", user: users[4], replies: 8, lastReply: "1 day ago" },
    ];
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">Community Forum</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Ask questions, share your projects, and connect with the community.
          </p>
          <div className="space-y-4">
            {forumThreads.map((thread, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                <div className="flex items-center gap-4">
                    <Avatar>
                        <AvatarImage src={thread.user.avatarUrl} alt={thread.user.name} />
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
