import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
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
                    About SkillSwap Hub
                </h1>
                <p className="mt-4 text-muted-foreground md:text-xl">
                    Exchange skills, enrich your life. Join a community of learners and mentors.
                </p>
            </div>
            <div className="max-w-3xl mx-auto mt-12 space-y-6 text-lg">
                <p>
                    Welcome to SkillSwap Hub, a platform dedicated to the idea that everyone has something to teach and something to learn. We believe that knowledge and skills are best shared, not just consumed. Our mission is to create a vibrant community where individuals can connect, collaborate, and grow together by exchanging their unique talents.
                </p>
                <p>
                    Whether you're a seasoned expert or a curious beginner, SkillSwap Hub provides the tools to find your perfect learning partner. Want to learn how to code? Maybe there's a developer who wants to learn your public speaking skills. Looking to master the art of bread-making? Perhaps a baker in your neighborhood wants to learn how you do your graphic design work. The possibilities are endless.
                </p>
                <p>
                    Our platform is built on the principles of trust, community, and mutual respect. We aim to foster a supportive environment where users can confidently share their passions and embark on new learning adventures.
                </p>
                <p>
                    Join us today and become part of a movement that values collaboration over competition, and personal growth over passive consumption. Let's build a more skilled, connected, and enriched world, one swap at a time.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
