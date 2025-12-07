import { Logo } from "@/components/logo";

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto prose prose-blue">
          <h1 className="text-4xl font-bold font-headline mb-4">Cookie Policy</h1>
          <p className="text-muted-foreground">Last updated: December 07, 2023</p>

          <p>
            This Cookie Policy explains what cookies are and how we use them on SkillSwap Hub. You should read this policy to understand what cookies are, how we use them, the types of cookies we use, the information we collect using cookies, and how that information is used.
          </p>

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files that are stored on your browser or the hard drive of your computer or other device when you visit a website. This allows the site to recognise you as a user either for the duration of your visit (using a ‘session cookie’) or for repeat visits (a ‘persistent cookie’).
          </p>

          <h2>How We Use Cookies</h2>
          <p>
            We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Authentication:</strong> We use cookies to identify you when you visit our website and as you navigate our website.</li>
            <li><strong>Personalization:</strong> We use cookies to store information about your preferences and to personalize the website for you.</li>
            <li><strong>Security:</strong> We use cookies as an element of the security measures used to protect user accounts, including preventing fraudulent use of login credentials, and to protect our website and services generally.</li>
          </ul>

          <h2>Disabling Cookies</h2>
          <p>
            You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site.
          </p>
        </div>
      </main>
    </div>
  );
}
