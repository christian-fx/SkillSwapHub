import type { User, Conversation } from "@/lib/types";
import placeholderData from "@/lib/placeholder-images.json";

const { placeholderImages } = placeholderData;

const imageMap = new Map(placeholderImages.map(image => [image.id, image]));

const findImage = (id: string) => {
    const image = imageMap.get(id);
    return {
        imageUrl: image?.imageUrl ?? `https://placehold.co/200x200?text=${id}`,
        imageHint: image?.imageHint ?? "placeholder"
    };
};

export const users: User[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatarUrl: findImage("user-1").imageUrl,
    avatarHint: findImage("user-1").imageHint,
    bio: "Passionate graphic designer with a love for typography and branding. Looking to learn pottery to unwind and create with my hands.",
    location: "New York, NY",
    skillsOffered: [
      { id: "skill-1", name: "Graphic Design" },
      { id: "skill-2", name: "Illustration" },
      { id: "skill-3", name: "Branding" },
    ],
    skillsNeeded: [
      { id: "skill-10", name: "Pottery" },
      { id: "skill-11", name: "Creative Writing" },
    ],
  },
  {
    id: "user-2",
    name: "Bob Williams",
    email: "bob@example.com",
    avatarUrl: findImage("user-2").imageUrl,
    avatarHint: findImage("user-2").imageHint,
    bio: "Software developer by day, aspiring chef by night. I can build you a website in exchange for some authentic Italian cooking lessons.",
    location: "San Francisco, CA",
    skillsOffered: [
      { id: "skill-4", name: "Web Development" },
      { id: "skill-5", name: "React" },
      { id: "skill-6", name: "Node.js" },
    ],
    skillsNeeded: [
      { id: "skill-12", name: "Cooking" },
      { id: "skill-13", name: "Guitar" },
    ],
  },
  {
    id: "user-3",
    name: "Charlie Brown",
    email: "charlie@example.com",
    avatarUrl: findImage("user-3").imageUrl,
    avatarHint: findImage("user-3").imageHint,
    bio: "I'm a writer and editor looking to get my finances in order. I can help you with your blog or manuscript!",
    location: "London, UK",
    skillsOffered: [
      { id: "skill-11", name: "Creative Writing" },
      { id: "skill-7", name: "Editing" },
      { id: "skill-8", name: "Content Strategy" },
    ],
    skillsNeeded: [
      { id: "skill-14", name: "Personal Finance" },
      { id: "skill-1", name: "Graphic Design" },
    ],
  },
  {
    id: "user-4",
    name: "Diana Prince",
    email: "diana@example.com",
    avatarUrl: findImage("user-4").imageUrl,
    avatarHint: findImage("user-4").imageHint,
    bio: "Fitness instructor and nutritionist. I can create a personalized workout and meal plan for you. Seeking help with social media marketing.",
    location: "Miami, FL",
    skillsOffered: [
      { id: "skill-9", name: "Fitness Coaching" },
      { id: "skill-15", name: "Nutrition Planning" },
    ],
    skillsNeeded: [
      { id: "skill-16", name: "Social Media Marketing" },
      { id: "skill-4", name: "Web Development" },
    ],
  },
  {
    id: "user-5",
    name: "Ethan Hunt",
    email: "ethan@example.com",
    avatarUrl: findImage("user-5").imageUrl,
    avatarHint: findImage("user-5").imageHint,
    bio: "Skilled carpenter and woodworker. Can build custom furniture. I'd love to learn how to play the guitar.",
    location: "Austin, TX",
    skillsOffered: [
        { id: "skill-17", name: "Carpentry" },
        { id: "skill-18", name: "Woodworking" },
    ],
    skillsNeeded: [
        { id: "skill-13", name: "Guitar" },
    ],
  },
   {
    id: "user-6",
    name: "Fiona Glenanne",
    email: "fiona@example.com",
    avatarUrl: findImage("user-6").imageUrl,
    avatarHint: findImage("user-6").imageHint,
    bio: "Expert in public speaking and presentation skills. Looking to learn basic coding to build a personal project.",
    location: "Chicago, IL",
    skillsOffered: [
        { id: "skill-19", name: "Public Speaking" },
        { id: "skill-20", name: "Presentation Design" },
    ],
    skillsNeeded: [
        { id: "skill-5", name: "React" },
        { id: "skill-6", name: "Node.js" },
    ],
  },
];

export const conversations: Conversation[] = [
  {
    id: "conv-1",
    participant: users[1],
    messages: [
      { id: "msg-1", senderId: "user-2", text: "Hey! I saw you're looking for pottery lessons. I'm a beginner but I have a wheel. Maybe we can practice together?", timestamp: "2024-05-20T10:00:00Z" },
      { id: "msg-2", senderId: "user-1", text: "That sounds great, Bob! I'd love that. I can help you with some logo ideas for your new cooking blog in return.", timestamp: "2024-05-20T10:05:00Z" },
    ],
    get lastMessage() { return this.messages[this.messages.length - 1] },
  },
    {
    id: "conv-2",
    participant: users[2],
    messages: [
      { id: "msg-3", senderId: "user-3", text: "Hi Alice, I need some help with a cover design for my manuscript. Your work is amazing!", timestamp: "2024-05-19T14:30:00Z" },
      { id: "msg-4", senderId: "user-1", text: "Hi Charlie! Thanks so much. I'd be happy to take a look. I'm actually looking for someone to help me brainstorm some story ideas. Maybe we can help each other out?", timestamp: "2024-05-19T14:35:00Z" },
       { id: "msg-5", senderId: "user-3", text: "That's perfect! I'd love to. Let's chat more this week.", timestamp: "2024-05-19T14:40:00Z" },
    ],
    get lastMessage() { return this.messages[this.messages.length - 1] },
  },
];
