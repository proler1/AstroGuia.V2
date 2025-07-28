export interface ChatRoom {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  type: 'general' | 'fire' | 'earth' | 'air' | 'water' | 'private' | 'other';
  memberCount: number;
  lastMessage?: ChatMessage;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  text?: string;
  imageUrl?: string;
  createdAt: string;
  isRead: boolean;
}

export interface ChatUser {
  id: string;
  displayName: string;
  photoURL?: string;
  zodiacSign?: string;
  isOnline: boolean;
  lastActive?: string;
}

export const defaultChatRooms: Partial<ChatRoom>[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Chat about all things astrology',
    type: 'general',
    memberCount: 0,
  },
  {
    id: 'fire',
    name: 'Fire Signs',
    description: 'Aries, Leo, Sagittarius',
    type: 'fire',
    memberCount: 0,
  },
  {
    id: 'earth',
    name: 'Earth Signs',
    description: 'Taurus, Virgo, Capricorn',
    type: 'earth',
    memberCount: 0,
  },
  {
    id: 'air',
    name: 'Air Signs',
    description: 'Gemini, Libra, Aquarius',
    type: 'air',
    memberCount: 0,
  },
  {
    id: 'water',
    name: 'Water Signs',
    description: 'Cancer, Scorpio, Pisces',
    type: 'water',
    memberCount: 0,
  },
];