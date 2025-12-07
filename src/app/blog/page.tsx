import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
                    The SkillSwap Blog
                </h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                    Stories, tips, and insights from our community.
                </p>
            </div>
          <div className="max-w-3xl mx-auto mt-12 space-y-8">
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
