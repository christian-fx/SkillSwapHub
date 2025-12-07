import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GuidelinesPage() {
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
              Community Guidelines
            </h1>
            <p className="mt-4 text-muted-foreground md:text-xl">
              Help us build a safe, respectful, and collaborative environment.
            </p>
          </div>
          <div className="max-w-3xl mx-auto mt-12 space-y-8">
            <div>
              <h2 className="text-2xl font-bold">1. Be Respectful</h2>
              <p className="mt-2 text-muted-foreground">Treat every member of the community with kindness and respect. We do not tolerate harassment, discrimination, or hate speech of any kind. Engage in conversations with an open mind and a positive attitude.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">2. Be Honest and Clear</h2>
              <p className="mt-2 text-muted-foreground">Represent your skills and what you're looking to learn accurately. When proposing a swap, be clear about your expectations and what you can offer in return. Clear communication is the key to a successful skill exchange.</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold">3. Honor Your Commitments</h2>
              <p className="mt-2 text-muted-foreground">When you agree to a skill swap, do your best to honor that commitment. Show up for scheduled sessions and put in the effort to both teach and learn. If you need to reschedule or cancel, communicate with your partner as early as possible.</p>
            </div>
             <div>
              <h2 className="text-2xl font-bold">4. Keep it Safe</h2>
              <p className="mt-2 text-muted-foreground">Protect your personal information. Use our platform's messaging system to communicate initially. When meeting in person, choose public places. Report any suspicious or inappropriate behavior to our support team immediately.</p>
            </div>
             <div>
              <h2 className="text-2xl font-bold">5. Give Constructive Feedback</h2>
              <p className="mt-2 text-muted-foreground">Feedback is a gift that helps us grow. When providing feedback to your swap partner, be constructive and focus on specific ways they can improve. When receiving feedback, be open and appreciative.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
