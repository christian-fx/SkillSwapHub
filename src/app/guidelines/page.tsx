import { Logo } from "@/components/logo";

export default function GuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">Community Guidelines</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Help us build a safe, respectful, and collaborative environment.
          </p>
          <div className="space-y-6 text-foreground">
            <div>
              <h2 className="text-2xl font-semibold mb-2">1. Be Respectful</h2>
              <p>Treat every member of the community with kindness and respect. We do not tolerate harassment, discrimination, or hate speech of any kind. Engage in conversations with an open mind and a positive attitude.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">2. Be Honest and Clear</h2>
              <p>Represent your skills and what you're looking to learn accurately. When proposing a swap, be clear about your expectations and what you can offer in return. Clear communication is the key to a successful skill exchange.</p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-2">3. Honor Your Commitments</h2>
              <p>When you agree to a skill swap, do your best to honor that commitment. Show up for scheduled sessions and put in the effort to both teach and learn. If you need to reschedule or cancel, communicate with your partner as early as possible.</p>
            </div>
             <div>
              <h2 className="text-2xl font-semibold mb-2">4. Keep it Safe</h2>
              <p>Protect your personal information. Use our platform's messaging system to communicate initially. When meeting in person, choose public places. Report any suspicious or inappropriate behavior to our support team immediately.</p>
            </div>
             <div>
              <h2 className="text-2xl font-semibold mb-2">5. Give Constructive Feedback</h2>
              <p>Feedback is a gift that helps us grow. When providing feedback to your swap partner, be constructive and focus on specific ways they can improve. When receiving feedback, be open and appreciative.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
