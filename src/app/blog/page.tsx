import { Logo } from "@/components/logo";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "The Power of Peer-to-Peer Learning",
      description: "Discover why learning from a peer can be more effective than traditional methods and how to get the most out of your skill swap.",
      date: "December 1, 2023",
      author: "Jane Doe"
    },
    {
      title: "5 Skills You Can Learn This Month on SkillSwap Hub",
      description: "Looking for inspiration? Here are five popular and rewarding skills you can start learning today by connecting with an expert in our community.",
      date: "November 15, 2023",
      author: "John Smith"
    },
    {
      title: "From Student to Teacher: A Skill-Swapper's Journey",
      description: "Read the inspiring story of a user who went from learning a new skill to teaching it to others on the platform, embodying the spirit of our community.",
      date: "October 28, 2023",
      author: "Alice Johnson"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">The SkillSwap Blog</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Stories, tips, and insights from our community.
          </p>
          <div className="space-y-8">
            {posts.map((post, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground pt-1">By {post.author} on {post.date}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{post.description}</p>
                </CardContent>
                <CardFooter>
                    <Link href="#" className="flex items-center text-primary font-semibold">
                        Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
