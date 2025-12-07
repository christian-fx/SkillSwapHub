import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";
import Link from "next/link";

export default function EventsPage() {
    const upcomingEvents = [
        {
            title: "Community Meet & Greet",
            description: "An informal gathering for new and old members to connect, share ideas, and find potential swap partners.",
            date: "January 15, 2024",
            location: "Online",
        },
        {
            title: "Workshop: Intro to Public Speaking",
            description: "Join expert speaker Fiona Glenanne for a free introductory workshop on the basics of public speaking.",
            date: "February 2, 2024",
            location: "New York, NY",
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
                Community Events
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
                Join our workshops, meetups, and community events.
            </p>
          </div>
           <div className="max-w-3xl mx-auto mt-12 space-y-8">
            {upcomingEvents.map((event, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{event.description}</p>
                   <div className="flex items-center text-sm text-muted-foreground">
                     <Calendar className="mr-2 h-4 w-4" /> 
                     <span>{event.date}</span>
                   </div>
                   <div className="flex items-center text-sm text-muted-foreground mt-2">
                     <MapPin className="mr-2 h-4 w-4" /> 
                     <span>{event.location}</span>
                   </div>
                </CardContent>
                <CardFooter>
                    <Button>RSVP Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
