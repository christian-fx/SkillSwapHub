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
  isVerified?: boolean;
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
    isVerified?: boolean;
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

export type Notification = {
  id: string;
  type: 'message' | 'swap' | 'ai';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  user?: {
    name: string;
    avatarUrl: string;
    avatarHint: string;
  }
};

export type MarketplaceItem = {
  id: string;
  title: string;
  author: string;
  price: number;
  imageUrl: string;
  imageHint: string;
  type: 'eBook' | 'Template' | 'Guide' | 'Tool';
  isSoldOut?: boolean;
  quantity?: number;
};
