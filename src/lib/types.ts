import type { StaticImageData } from 'next/image';

export type Skill = {
  id: string;
  name: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  avatarHint: string;
  bio: string;
  location: string;
  skillsOffered: string[];
  skillsNeeded: string[];
};

export type UserProfile = {
    uid: string;
    name: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string;
    bio?: string;
    location?: string;
    skillsOffered?: string[];
    skillsNeeded?: string[];
}

export type Message = {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  participant: User;
  messages: Message[];
  lastMessage: Message;
};
