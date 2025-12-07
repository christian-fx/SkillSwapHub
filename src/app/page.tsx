import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, BrainCircuit, HeartHandshake, Linkedin, Twitter, Youtube, Facebook, Rss, Github, Mail, MessageCircle, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import placeholderData from "@/lib/placeholder-images.json";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
const user1Image = findImage('user-1');
const user2Image = findImage('user-2');
const user3Image = findImage('user-3');


export default function Home() {
  const features = [
    {
      icon: <HeartHandshake className="h-10 w-10 text-primary" />,
      title: "Create Your Profile",
      description: "Showcase the skills you're proud to offer and list the new talents you're excited to learn.",
      image: {
        src: feature1Image.imageUrl,
        hint: feature1Image.imageHint
      }
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Discover & Connect",
      description: "Browse a vibrant community of skilled individuals. Find the perfect match for your learning and teaching goals.",
      image: {
        src: feature2Image.imageUrl,
        hint: feature2Image.imageHint
      }
    },
    {
      icon: <BrainCircuit className="h-10 w-10 text-primary" />,
      title: "Swap & Grow",
      description: "Propose a skill exchange, chat with potential partners, and start your journey of mutual growth and collaboration.",
      image: {
        src: feature3Image.imageUrl,
        hint: feature3Image.imageHint
      }
    },
  ];

  const featuredSkills = ["Pottery", "Web Development", "Creative Writing", "Fitness Coaching", "Guitar", "Social Media Marketing", "Carpentry", "Public Speaking"];

  const testimonials = [
    {
      name: "Alice J.",
      avatar: user1Image.imageUrl,
      avatarHint: user1Image.imageHint,
      title: "Found my inner artist!",
      quote: "I traded my graphic design skills for pottery lessons, and it's been a life-changing experience. SkillSwap Hub made it so easy to connect with someone patient and talented. Highly recommend!",
    },
    {
      name: "Bob W.",
      avatar: user2Image.imageUrl,
      avatarHint: user2Image.imageHint,
      title: "Finally learned to code.",
      quote: "As a chef, I always wanted to build my own recipe website. I swapped cooking lessons for web development tutoring. The platform is amazing for finding people with the right skills and a willingness to share.",
    },
    {
      name: "Charlie B.",
      avatar: user3Image.imageUrl,
      avatarHint: user3Image.imageHint,
      title: "A community of givers.",
      quote: "What I love most about SkillSwap Hub is the community. Everyone is here to learn and to give back. It's more than just a platform; it's a movement of collaborative growth.",
    },
  ];


  const socialLinks = [
    { icon: <Twitter />, href: "#" },
    { icon: <Facebook />, href: "#" },
    { icon: <Linkedin />, href: "#" },
    { icon: <Github />, href: "#" },
    { icon: <Youtube />, href: "#" },
    { icon: <Rss />, href: "#" },
  ];

  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 z-50 bg-background/80 backdrop-blur-sm">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
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
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-4">
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
                height="400"
                alt="Hero"
                data-ai-hint={heroImage.imageHint}
                className="mx-auto overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Simple Steps to Start Swapping</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to make skill sharing simple, intuitive, and rewarding.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-1 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                 <div key={index} className="flex flex-col items-center text-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="featured-skills" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Skills You Can Swap</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  From creative arts to technical expertise, discover a world of knowledge waiting for you.
                </p>
              </div>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-2">
                {featuredSkills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-base px-4 py-2 rounded-lg">
                        {skill}
                    </Badge>
                ))}
            </div>
             <div className="text-center mt-8">
                <Button variant="link" asChild>
                    <Link href="/browse">See All Skills <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">What Our Community Is Saying</h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Real stories from people who have transformed their lives by sharing skills.
              </p>
            </div>
            <div className="grid w-full grid-cols-1 lg:grid-cols-3 gap-6 pt-12">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="flex flex-col">
                  <CardContent className="flex-1 p-6 text-left">
                    <div className="flex items-center gap-1 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    </div>
                    <p className="text-foreground font-semibold">{testimonial.title}</p>
                    <blockquote className="mt-2 text-muted-foreground">"{testimonial.quote}"</blockquote>
                  </CardContent>
                  <CardFooter className="p-6 pt-0 flex items-center gap-3 bg-secondary/30">
                    <Avatar className="w-12 h-12 border-2 border-background">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm font-semibold">Get Started</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl font-headline">Ready to Join?</h2>
                <p className="max-w-[600px] text-muted-foreground">
                  Create your profile in minutes and start your skill-swapping journey today. Your next mentor or student is just a click away.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row lg:justify-end">
                <Button asChild size="lg">
                  <Link href="/signup">Sign Up Now</Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/browse">Browse Skills</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <footer className="bg-card border-t">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div>
                <Logo />
                <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Exchange skills, enrich your life. Join a community of learners and mentors.
                </p>
                <div className="mt-8 flex space-x-4">
                    {socialLinks.map((link, index) => (
                        <Link key={index} href={link.href} className="text-muted-foreground hover:text-primary">
                            {link.icon}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-4">
                <div>
                <p className="font-medium text-foreground">Company</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">About</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Careers</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Blog</Link></li>
                </ul>
                </div>
                <div>
                <p className="font-medium text-foreground">Community</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Guidelines</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Events</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Forum</Link></li>
                </ul>
                </div>
                <div>
                <p className="font-medium text-foreground">Support</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Help Center</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Contact Us</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
                </ul>
                </div>
                 <div>
                <p className="font-medium text-foreground">Legal</p>
                <ul className="mt-4 space-y-2 text-sm">
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Terms of Service</Link></li>
                    <li><Link href="#" className="text-muted-foreground hover:text-primary">Cookie Policy</Link></li>
                </ul>
                </div>
            </div>
            </div>
            <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} SkillSwap Hub. All rights reserved.</p>
            </div>
        </div>
        </footer>
    </div>
  );
}
