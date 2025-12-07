import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">Careers at SkillSwap Hub</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Join our mission to connect learners and mentors worldwide.
          </p>
          <div className="space-y-8 text-foreground">
            <div>
                <h2 className="text-2xl font-semibold mb-2">Why Join Us?</h2>
                <p>
                    We are a passionate team dedicated to building a platform that empowers individuals to grow and share their knowledge. We believe in a collaborative, innovative, and inclusive work environment. If you are driven by the desire to make a positive impact and love tackling new challenges, SkillSwap Hub might be the perfect place for you.
                </p>
            </div>
            <div>
                <h2 className="text-2xl font-semibold mb-2">Current Openings</h2>
                <p className="text-muted-foreground mb-4">
                    We are always looking for talented individuals. While we don't have specific roles open at this moment, we encourage you to send us your resume if you believe you'd be a great fit for our team.
                </p>
                <div className="border rounded-lg p-6">
                    <h3 className="font-bold">No open positions right now.</h3>
                    <p className="text-sm text-muted-foreground mt-1">Check back soon or send us a speculative application!</p>
                    <Button className="mt-4">Contact HR</Button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
