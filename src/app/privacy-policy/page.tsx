import { Logo } from "@/components/logo";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-4xl font-bold font-headline mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: December 07, 2023</p>

          <p>
            Welcome to SkillSwap Hub. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about our policy, or our practices with regards to your personal information, please contact us.
          </p>

          <h2>1. What Information Do We Collect?</h2>
          <p>
            We collect personal information that you voluntarily provide to us when you register on the SkillSwap Hub, express an interest in obtaining information about us or our products and services, when you participate in activities on the SkillSwap Hub or otherwise when you contact us. The personal information we collect may include your name, email address, skills, and other details you provide on your profile.
          </p>

          <h2>2. How Do We Use Your Information?</h2>
          <p>
            We use personal information collected via our SkillSwap Hub for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations.
          </p>

          <h2>3. Will Your Information Be Shared With Anyone?</h2>
          <p>
            We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. Your profile information, including your name and skills, will be visible to other users of the platform to facilitate skill swaps.
          </p>

          <h2>4. How Do We Keep Your Information Safe?</h2>
          <p>
            We aim to protect your personal information through a system of organizational and technical security measures. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure.
          </p>
        </div>
      </main>
    </div>
  );
}
