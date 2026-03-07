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
  rating: number;
  lastActive: string;
  status: 'online' | 'offline';
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
  status?: 'online' | 'offline';
}

export type Message = {
  id: string;
  senderId: string;
  text: string;
  createdAt: string | Date | any;
  read?: boolean;
  imageUrl?: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt?: string | Date | any;
  typingUsers?: string[];
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
    avatarHint?: string;
  };
  link?: string;
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
  preview?: string;
};

export type SwapRequest = {
  id: string;
  senderId: string;
  receiverId: string;
  offeredSkill: string;
  requestedSkill: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  message: string;
  createdAt: string | Date | any; // allow firestore timestamp
  updatedAt?: string | Date | any;
};
