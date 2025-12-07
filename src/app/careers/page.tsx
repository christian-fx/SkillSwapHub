import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CareersPage() {
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
              Careers at SkillSwap Hub
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Join our mission to connect learners and mentors worldwide.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">Why Join Us?</h2>
              <p className="mt-2 text-muted-foreground">
                We are a passionate team dedicated to building a platform that empowers individuals to grow and share their knowledge. We believe in a collaborative, innovative, and inclusive work environment. If you are driven by the desire to make a positive impact and love tackling new challenges, SkillSwap Hub might be the perfect place for you.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Current Openings</h2>
              <p className="mt-2 text-muted-foreground">
                We are always looking for talented individuals. While we don't have specific roles open at this moment, we encourage you to send us your resume if you believe you'd be a great fit for our team.
              </p>
              <div className="mt-6 border rounded-lg p-6 text-center">
                <h3 className="font-bold">No open positions right now.</h3>
                <p className="text-sm text-muted-foreground mt-1">Check back soon or send us a speculative application!</p>
                <Button className="mt-4" asChild>
                    <Link href="/contact-us">Contact HR</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
