import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  addDoc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp,
  onSnapshot 
} from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { ChatRoom, ChatMessage, ChatUser, defaultChatRooms } from '../models/Chat';

export class ChatService {
  // Get available chat rooms
  static async getChatRooms(): Promise<ChatRoom[]> {
    try {
      const roomsQuery = query(
        collection(firestore, 'chatRooms'),
        orderBy('updatedAt', 'desc')
      );
      
      const roomDocs = await getDocs(roomsQuery);
      
      if (!roomDocs.empty) {
        return roomDocs.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
          } as ChatRoom;
        });
      }
      
      // If no rooms found, return default rooms
      return this.getMockChatRooms();
    } catch (error: any) {
      console.error('Error getting chat rooms:', error);
      // Return mock data in case of error
      return this.getMockChatRooms();
    }
  }
  
  // Get a single chat room by ID
  static async getChatRoomById(roomId: string): Promise<ChatRoom | null> {
    try {
      const roomDoc = await getDoc(doc(firestore, 'chatRooms', roomId));
      
      if (roomDoc.exists()) {
        const data = roomDoc.data();
        return {
          ...data,
          id: roomDoc.id,
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString() || new Date().toISOString()
        } as ChatRoom;
      }
      
      // For development, return a mock room if not found
      const mockRooms = this.getMockChatRooms();
      const mockRoom = mockRooms.find(r => r.id === roomId);
      return mockRoom || null;
    } catch (error: any) {
      console.error(`Error getting chat room ${roomId}:`, error);
      throw error;
    }
  }
  
  // Get messages for a specific chat room
  static async getChatMessages(roomId: string, limit: number = 50): Promise<ChatMessage[]> {
    try {
      const messagesQuery = query(
        collection(firestore, 'chatMessages'),
        where('roomId', '==', roomId),
        orderBy('createdAt', 'desc'),
        limit(limit)
      );
      
      const messageDocs = await getDocs(messagesQuery);
      
      if (!messageDocs.empty) {
        const messages = messageDocs.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id,
            createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString()
          } as ChatMessage;
        });
        
        // Return in chronological order
        return messages.reverse();
      }
      
      // If no messages found, return mock messages
      return this.getMockChatMessages(roomId);
    } catch (error: any) {
      console.error(`Error getting messages for room ${roomId}:`, error);
      // Return mock data in case of error
      return this.getMockChatMessages(roomId);
    }
  }
  
  // Send a new chat message
  static async sendMessage(roomId: string, userId: string, userName: string, text: string, userAvatar?: string, imageUrl?: string): Promise<ChatMessage> {
    try {
      const message = {
        roomId,
        userId,
        userName,
        userAvatar,
        text,
        imageUrl,
        createdAt: serverTimestamp(),
        isRead: false
      };
      
      // Add the message to Firestore
      const messageRef = await addDoc(collection(firestore, 'chatMessages'), message);
      
      // Update the room's last message and timestamp
      await updateDoc(doc(firestore, 'chatRooms', roomId), {
        lastMessage: {
          text: text?.substring(0, 50) + (text && text.length > 50 ? '...' : '') || '[Image]',
          userName,
          createdAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
      });
      
      // Return the newly created message with its ID
      return {
        ...message,
        id: messageRef.id,
        createdAt: new Date().toISOString()
      };
    } catch (error: any) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
  
  // Listen to new messages in a room
  static subscribeToMessages(roomId: string, callback: (messages: ChatMessage[]) => void): () => void {
    const messagesQuery = query(
      collection(firestore, 'chatMessages'),
      where('roomId', '==', roomId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString() 
            : (typeof data.createdAt === 'string' ? data.createdAt : new Date().toISOString())
        } as ChatMessage;
      }).reverse(); // Reverse to get chronological order
      
      callback(messages);
    }, (error) => {
      console.error('Error subscribing to messages:', error);
      // Fallback to mock data if there's an error
      callback(this.getMockChatMessages(roomId));
    });
    
    return unsubscribe;
  }
  
  // Get online users in a chat room
  static async getOnlineUsers(roomId: string): Promise<ChatUser[]> {
    try {
      const usersQuery = query(
        collection(firestore, 'chatUsers'),
        where('roomId', '==', roomId),
        where('isOnline', '==', true)
      );
      
      const userDocs = await getDocs(usersQuery);
      
      if (!userDocs.empty) {
        return userDocs.docs.map(doc => doc.data() as ChatUser);
      }
      
      return [];
    } catch (error: any) {
      console.error(`Error getting online users for room ${roomId}:`, error);
      return [];
    }
  }
  
  // Update user online status
  static async updateUserStatus(userId: string, isOnline: boolean): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'chatUsers', userId), {
        isOnline,
        lastActive: serverTimestamp()
      });
    } catch (error: any) {
      console.error('Error updating user status:', error);
    }
  }
  
  // Mock data functions for development and fallback
  private static getMockChatRooms(): ChatRoom[] {
    return defaultChatRooms.map((room, index) => {
      const now = new Date();
      const createdAt = new Date(now.getTime() - (index + 1) * 24 * 60 * 60 * 1000).toISOString();
      const updatedAt = new Date(now.getTime() - index * 3 * 60 * 60 * 1000).toISOString();
      
      const mockRoom: ChatRoom = {
        id: room.id || `room_${index}`,
        name: room.name || `Chat Room ${index + 1}`,
        description: room.description || `Description for chat room ${index + 1}`,
        type: room.type || 'general',
        memberCount: room.memberCount || Math.floor(Math.random() * 100) + 5,
        createdAt,
        updatedAt,
        imageUrl: room.imageUrl || `https://via.placeholder.com/50?text=${index + 1}`
      };
      
      // Add a last message for some rooms
      if (index < 3) {
        mockRoom.lastMessage = {
          id: `last_msg_${index}`,
          roomId: mockRoom.id,
          userId: `user_${Math.floor(Math.random() * 10) + 1}`,
          userName: ['Sophia', 'Miguel', 'Luna', 'Carlos', 'Isabel'][Math.floor(Math.random() * 5)],
          text: [
            'Has anyone experienced Saturn return yet?',
            'Looking forward to tonight\'s full moon!',
            'How does Mercury retrograde affect Pisces?',
            'Just got my birth chart done, wow!',
            'Anyone else feeling the energy shift today?'
          ][Math.floor(Math.random() * 5)],
          createdAt: new Date(now.getTime() - Math.floor(Math.random() * 60) * 60 * 1000).toISOString(),
          isRead: Math.random() > 0.5
        };
      }
      
      return mockRoom;
    });
  }
  
  private static getMockChatMessages(roomId: string): ChatMessage[] {
    const messages: ChatMessage[] = [];
    const users = [
      { id: 'user_1', name: 'Sophia', avatar: 'https://via.placeholder.com/40?text=S' },
      { id: 'user_2', name: 'Miguel', avatar: 'https://via.placeholder.com/40?text=M' },
      { id: 'user_3', name: 'Luna', avatar: 'https://via.placeholder.com/40?text=L' },
      { id: 'user_4', name: 'Carlos', avatar: 'https://via.placeholder.com/40?text=C' },
      { id: 'user_5', name: 'Isabel', avatar: 'https://via.placeholder.com/40?text=I' }
    ];
    
    // Generate mock conversation based on room type
    let conversation: string[] = [];
    
    switch (roomId) {
      case 'general':
        conversation = [
          "Hi everyone! I'm new to astrology. Where should I start?",
          "Welcome! I'd recommend learning about your Sun, Moon, and Rising signs first.",
          "Exactly! And the AstroGuía app has great beginner resources in the Learn section.",
          "Does anyone have recommendations for books on astrology basics?",
          "I loved 'The Only Astrology Book You'll Ever Need' by Joanna Martine Woolfolk.",
          "Parker's Astrology is also excellent, very visual and comprehensive!",
          "Thanks for the recommendations! I'll check those out."
        ];
        break;
      case 'fire':
        conversation = [
          "Fellow fire signs! How are you handling this Mars transit?",
          "As a Leo, I'm FEELING it! So much creative energy but also some frustration.",
          "Sagittarius here and honestly I've been channeling it into travel planning.",
          "Aries here! I've started three new projects this week alone. Can't stop won't stop!",
          "That's so Aries of you 😂 I need to focus my energy better too.",
          "Anyone else finding it hard to sleep lately with all this fiery energy?",
          "Try physical exercise before bed. Really helps me burn off the excess!"
        ];
        break;
      case 'earth':
        conversation = [
          "How's everyone handling the Uranus in Taurus transit?",
          "As a Virgo, I'm finding myself questioning and reorganizing all my systems.",
          "Taurus here - it's been challenging but I'm learning to embrace change more.",
          "Capricorn rising, and I'm restructuring my career path completely.",
          "I think earth signs are really being asked to revolutionize how we approach security.",
          "Agreed. It's uncomfortable but necessary growth for us stability-lovers.",
          "Has anyone found good grounding techniques during this transit?"
        ];
        break;
      case 'air':
        conversation = [
          "This Mercury retrograde hitting anyone else particularly hard?",
          "Libra here, and YES. All my carefully balanced relationships need renegotiation.",
          "Aquarius sun, and my technology keeps breaking down at the worst times!",
          "Gemini rising, and I've been misspeaking and being misunderstood constantly.",
          "Classic Mercury retrograde! Have you tried slowing down communication?",
          "I'm actually enjoying the chance to revise and rethink some old projects.",
          "That's a great perspective! I should use this time for reflection too."
        ];
        break;
      case 'water':
        conversation = [
          "How are my fellow water signs feeling with this full moon coming up?",
          "Pisces here, and I'm basically an emotional sponge right now. So sensitive!",
          "Cancer sun, and I'm nesting hardcore. Cleaned my entire apartment yesterday.",
          "Scorpio rising, and I'm diving deep into shadow work. Intense but necessary.",
          "I find salt baths really help during intense lunar periods.",
          "Great suggestion! I also use water visualization meditations.",
          "Does anyone else get vivid dreams during water-heavy lunar phases?"
        ];
        break;
      default:
        conversation = [
          "Hello! Anyone active in this room?",
          "Hi there! Yes, just browsing through different chat rooms.",
          "What's your zodiac sign?",
          "I'm a Gemini sun with Pisces moon. You?",
          "Taurus with Leo rising! Interesting combination.",
          "Very! How long have you been into astrology?",
          "About 3 years now. Still learning so much every day."
        ];
    }
    
    // Create messages from the conversation
    const now = new Date();
    for (let i = 0; i < conversation.length; i++) {
      const randomUser = users[i % users.length];
      const messageTime = new Date(now.getTime() - (conversation.length - i) * 5 * 60 * 1000);
      
      messages.push({
        id: `msg_${roomId}_${i}`,
        roomId,
        userId: randomUser.id,
        userName: randomUser.name,
        userAvatar: randomUser.avatar,
        text: conversation[i],
        createdAt: messageTime.toISOString(),
        isRead: true
      });
    }
    
    return messages;
  }
}