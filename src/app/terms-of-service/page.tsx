import { Logo } from "@/components/logo";

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-4xl font-bold font-headline mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: December 07, 2023</p>

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
      </main>
    </div>
  );
}
