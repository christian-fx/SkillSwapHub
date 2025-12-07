import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar } from "lucide-react";

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
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">Events</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Join our workshops, meetups, and community events.
          </p>
           <div className="space-y-8">
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
