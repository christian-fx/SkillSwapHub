import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Leaf, Replace, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import placeholderData from "@/lib/placeholder-images.json";

const { placeholderImages } = placeholderData;
const imageMap = new Map(placeholderImages.map(image => [image.id, image]));

const findImage = (id: string) => {
    const image = imageMap.get(id);
    return {
        imageUrl: image?.imageUrl ?? `https://placehold.co/600x400?text=Not+Found`,
        imageHint: image?.imageHint ?? "placeholder"
    };
};

const heroImage = findImage('hero');
const feature1Image = findImage('feature-1');
const feature2Image = findImage('feature-2');
const feature3Image = findImage('feature-3');

export default function Home() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Create Your Profile",
      description: "Showcase the skills you're proud to offer and list the new talents you're excited to learn.",
      image: {
        src: feature1Image.imageUrl,
        hint: feature1Image.imageHint
      }
    },
    {
      icon: <Replace className="h-8 w-8 text-accent" />,
      title: "Discover & Connect",
      description: "Browse a vibrant community of skilled individuals. Find the perfect match for your learning and teaching goals.",
      image: {
        src: feature2Image.imageUrl,
        hint: feature2Image.imageHint
      }
    },
    {
      icon: <Leaf className="h-8 w-8 text-accent" />,
      title: "Swap & Grow",
      description: "Propose a skill exchange, chat with potential partners, and start your journey of mutual growth and collaboration.",
      image: {
        src: feature3Image.imageUrl,
        hint: feature3Image.imageHint
      }
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Exchange Skills, Enrich Your Life
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Join SkillSwap Hub to connect with a community of learners and mentors. Trade your talents, learn new things, and grow together.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild>
                    <Link href="/signup">
                      Join the Community
                    </Link>
                  </Button>
                  <Button size="lg" variant="secondary" asChild>
                    <Link href="#features">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <Image
                src={heroImage.imageUrl}
                width="600"
                height="600"
                alt="Hero"
                data-ai-hint={heroImage.imageHint}
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to make skill sharing simple, intuitive, and rewarding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader className="flex flex-col items-center text-center">
                    {feature.icon}
                    <CardTitle className="mt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center text-center">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; {new Date().getFullYear()} SkillSwap Hub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
