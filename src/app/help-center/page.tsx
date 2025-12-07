import { Logo } from "@/components/logo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function HelpCenterPage() {
    const faqs = [
        {
            question: "How do I propose a skill swap?",
            answer: "Navigate to the 'Browse' page, find a user you'd like to connect with, and click the 'Propose Swap' button on their profile card. This will open a dialog where you can write a message to them."
        },
        {
            question: "Is SkillSwap Hub free to use?",
            answer: "Yes, our platform is completely free. We believe in making learning and sharing accessible to everyone."
        },
        {
            question: "How do I add or remove skills from my profile?",
            answer: "Go to your 'Profile' page and click on the 'Manage Skills' tab. You'll find options to add new skills you offer or need, as well as remove existing ones."
        }
    ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <Logo />
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold font-headline mb-4">Help Center</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Find answers to common questions.
          </p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
                 <AccordionItem value={`item-${index}`} key={index}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
    </div>
  );
}
