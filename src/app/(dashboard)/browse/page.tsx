import Image from "next/image";
import Link from "next/link";
import { Search, SlidersHorizontal, ArrowRight } from "lucide-react";

import { users } from "@/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function BrowsePage() {
  return (
    <>
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">
            Discover Skills
            </h1>
            <p className="text-muted-foreground">
            Browse profiles to find your next skill swap.
            </p>
        </div>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search skills or people..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter</span>
          </Button>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {users.map((user) => (
          <Card key={user.id} className="flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.avatarHint} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.location}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex-grow">
              <div>
                <h3 className="text-sm font-semibold mb-2">Offers:</h3>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.map((skill) => (
                    <Badge key={skill.id} variant="secondary">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-semibold mb-2">Needs:</h3>
                <div className="flex flex-wrap gap-1">
                  {user.skillsNeeded.map((skill) => (
                    <Badge key={skill.id} variant="outline">
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    Propose Swap <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Propose a Swap with {user.name}</DialogTitle>
                    <DialogDescription>
                      Let them know what you'd like to exchange.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="grid gap-2">
                      <Label htmlFor="message">Your Message</Label>
                      <Textarea id="message" placeholder={`Hi ${user.name}, I'd love to learn...`} />
                    </div>
                  </div>
                  <Button>Send Proposal</Button>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  );
}
