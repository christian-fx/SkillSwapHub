import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsOfServicePage() {
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
          <div className="max-w-3xl mx-auto">
             <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                  Terms of Service
                </h1>
                <p className="mt-4 text-muted-foreground">Last updated: December 07, 2023</p>
            </div>
            <div className="prose prose-lg max-w-none mx-auto mt-12">
                <p>
                    Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the SkillSwap Hub website (the "Service") operated by SkillSwap Hub ("us", "we", or "our").
                </p>

                <h2>1. Agreement to Terms</h2>
                <p>
                    By using our Service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you do not have permission to access the Service.
                </p>

                <h2>2. User Accounts</h2>
                <p>
                    When you create an account with us, you guarantee that you are above the age of 18, and that the information you provide us is accurate, complete, and current at all times. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
                </p>

                <h2>3. User Conduct</h2>
                <p>
                    You agree not to use the Service to post or transmit any content that is illegal, threatening, defamatory, or obscene. You are solely responsible for your interactions with other users of the Service. We reserve the right, but have no obligation, to monitor disputes between you and other users.
                </p>

                <h2>4. Termination</h2>
                <p>
                    We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
                </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
