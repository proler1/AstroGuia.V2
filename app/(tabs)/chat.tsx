import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableOpacity, Image } from 'react-native';
import { Text, TextInput, Avatar, IconButton, ActivityIndicator, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../src/contexts/ThemeContext';
import { useAuth } from '../../src/contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn } from 'react-native-reanimated';

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  zodiacSign?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  icon: string;
  participantsCount: number;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useTheme();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Mock data for chat rooms
  const chatRooms: ChatRoom[] = [
    { 
      id: 'general',
      name: t('chat.rooms.general'),
      description: t('chat.rooms.generalDesc'),
      icon: 'earth',
      participantsCount: 245
    },
    { 
      id: 'fire',
      name: t('chat.rooms.fire'),
      description: t('chat.rooms.fireDesc'),
      icon: 'fire',
      participantsCount: 87
    },
    { 
      id: 'earth',
      name: t('chat.rooms.earth'),
      description: t('chat.rooms.earthDesc'),
      icon: 'mountain',
      participantsCount: 65
    },
    { 
      id: 'air',
      name: t('chat.rooms.air'),
      description: t('chat.rooms.airDesc'),
      icon: 'weather-windy',
      participantsCount: 73
    },
    { 
      id: 'water',
      name: t('chat.rooms.water'),
      description: t('chat.rooms.waterDesc'),
      icon: 'water',
      participantsCount: 94
    },
  ];
  
  // Mock data for messages in the general room
  const mockMessages: ChatMessage[] = [
    {
      id: '1',
      userId: '1',
      userName: 'Luna',
      userAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
      content: "Hi everyone! How's Mercury retrograde treating you?",
      timestamp: new Date(Date.now() - 3600000 * 2),
      zodiacSign: 'pisces'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Orion',
      userAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      content: "It's been rough! My computer crashed twice today. Classic Mercury retrograde behavior!",
      timestamp: new Date(Date.now() - 3600000),
      zodiacSign: 'virgo'
    },
    {
      id: '3',
      userId: '3',
      userName: 'Stella',
      userAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      content: "I've been double-checking all my important emails and backing up everything.",
      timestamp: new Date(Date.now() - 3600000 / 2),
      zodiacSign: 'gemini'
    },
    {
      id: '4',
      userId: '4',
      userName: 'Nova',
      userAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      content: "Anyone else feeling extra introspective lately? I think it's the Scorpio season energy!",
      timestamp: new Date(Date.now() - 3600000 / 3),
      zodiacSign: 'scorpio'
    },
    {
      id: '5',
      userId: '5',
      userName: 'Leo',
      userAvatar: 'https://randomuser.me/api/portraits/men/5.jpg',
      content: "Definitely! I've been journaling a lot more than usual.",
      timestamp: new Date(Date.now() - 3600000 / 4),
      zodiacSign: 'leo'
    },
  ];
  
  useEffect(() => {
    // Set default room
    setSelectedRoom(chatRooms[0]);
  }, []);
  
  useEffect(() => {
    if (selectedRoom) {
      setLoading(true);
      
      // Simulate API call to fetch messages for selected room
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
        
        // Scroll to bottom of chat
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      }, 1000);
    }
  }, [selectedRoom]);
  
  const handleSendMessage = () => {
    if (!message.trim() || !user) return;
    
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: user.uid,
      userName: user.displayName || 'Anonymous',
      userAvatar: user.photoURL || undefined,
      content: message,
      timestamp: new Date(),
      zodiacSign: 'libra' // This would come from user profile in a real app
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Scroll to bottom of chat
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 100);
  };
  
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwnMessage = user && item.userId === user.uid;
    
    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessageContainer : null
      ]}>
        {!isOwnMessage && (
          <Avatar.Image 
            size={36} 
            source={item.userAvatar ? { uri: item.userAvatar } : require('../../assets/images/defaultavatar.jpg')} 
            style={styles.avatar}
          />
        )}
        
        <View style={[
          styles.messageContent,
          isOwnMessage ? [
            styles.ownMessageContent,
            { backgroundColor: isDarkMode ? '#6055c5' : '#9b95ff' }
          ] : {
            backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff'
          }
        ]}>
          {!isOwnMessage && (
            <View style={styles.messageHeader}>
              <Text style={[
                styles.userName,
                { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
              ]}>
                {item.userName}
              </Text>
              {item.zodiacSign && (
                <View style={styles.zodiacContainer}>
                  <MaterialCommunityIcons 
                    name={`zodiac-${item.zodiacSign}`} 
                    size={14} 
                    color={isDarkMode ? '#9b95ff' : '#6055c5'} 
                  />
                </View>
              )}
            </View>
          )}
          
          <Text style={[
            styles.messageText,
            isOwnMessage ? { color: '#ffffff' } : { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
          ]}>
            {item.content}
          </Text>
          
          <Text style={[
            styles.timestamp,
            isOwnMessage ? { color: 'rgba(255, 255, 255, 0.7)' } : { color: isDarkMode ? '#717191' : '#a0a0a0' }
          ]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </View>
    );
  };
  
  const renderRoomItem = (room: ChatRoom) => {
    const isSelected = selectedRoom?.id === room.id;
    
    return (
      <TouchableOpacity 
        key={room.id}
        style={[
          styles.roomItem,
          isSelected ? [
            styles.selectedRoomItem,
            { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
          ] : null
        ]}
        onPress={() => setSelectedRoom(room)}
      >
        <View style={[
          styles.roomIconContainer,
          isSelected ? { 
            backgroundColor: isDarkMode ? '#6055c5' : '#9b95ff' 
          } : {
            backgroundColor: isDarkMode ? '#2a2d42' : '#e0e8ff'
          }
        ]}>
          <MaterialCommunityIcons 
            name={room.icon as any} 
            size={24} 
            color="#ffffff" 
          />
        </View>
        
        <View style={styles.roomInfo}>
          <Text style={[
            styles.roomName,
            { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
          ]}>
            {room.name}
          </Text>
          
          <View style={styles.participantsContainer}>
            <MaterialCommunityIcons 
              name="account-group" 
              size={12} 
              color={isDarkMode ? '#717191' : '#a0a0a0'} 
            />
            <Text style={styles.participantsCount}>
              {room.participantsCount}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1a1a2c' }]}>
          {t('chat.title')}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={[
          styles.roomsList, 
          { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }
        ]}>
          {chatRooms.map(room => renderRoomItem(room))}
        </View>
        
        <View style={[
          styles.chatContainer,
          { backgroundColor: isDarkMode ? '#0f111a' : '#ffffff' }
        ]}>
          {selectedRoom && (
            <>
              <View style={[
                styles.roomHeader,
                { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
              ]}>
                <View style={styles.roomHeaderContent}>
                  <Text style={[
                    styles.roomHeaderTitle,
                    { color: isDarkMode ? '#ffffff' : '#1a1a2c' }
                  ]}>
                    {selectedRoom.name}
                  </Text>
                  
                  <Text style={[
                    styles.roomHeaderDescription,
                    { color: isDarkMode ? '#e0e0e0' : '#3a3a3c' }
                  ]}>
                    {selectedRoom.description}
                  </Text>
                </View>
              </View>
              
              {loading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={isDarkMode ? '#9b95ff' : '#6055c5'} />
                </View>
              ) : (
                <KeyboardAvoidingView
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                  style={styles.keyboardAvoid}
                  keyboardVerticalOffset={100}
                >
                  <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesContainer}
                  />
                  
                  <View style={[
                    styles.inputContainer,
                    { backgroundColor: isDarkMode ? '#191c2d' : '#f5f8ff' }
                  ]}>
                    <TextInput
                      value={message}
                      onChangeText={setMessage}
                      placeholder={t('chat.typePlaceholder')}
                      placeholderTextColor={isDarkMode ? '#717191' : '#a0a0a0'}
                      style={[
                        styles.input,
                        { 
                          backgroundColor: isDarkMode ? '#2a2d42' : '#ffffff',
                          color: isDarkMode ? '#ffffff' : '#1a1a2c'
                        }
                      ]}
                      multiline
                    />
                    
                    <IconButton
                      icon="send"
                      size={24}
                      iconColor={isDarkMode ? '#9b95ff' : '#6055c5'}
                      disabled={!message.trim()}
                      onPress={handleSendMessage}
                      style={styles.sendButton}
                    />
                  </View>
                </KeyboardAvoidingView>
              )}
            </>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  roomsList: {
    width: '30%',
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: '#e5e5e5',
  },
  roomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  selectedRoomItem: {
    borderLeftWidth: 3,
    borderLeftColor: '#6055c5',
  },
  roomIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  roomInfo: {
    flex: 1,
  },
  roomName: {
    fontSize: 14,
    fontWeight: '500',
  },
  participantsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  participantsCount: {
    fontSize: 12,
    marginLeft: 4,
    color: '#717191',
  },
  chatContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roomHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  roomHeaderContent: {
    
  },
  roomHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  roomHeaderDescription: {
    fontSize: 14,
    marginTop: 4,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  ownMessageContainer: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    marginRight: 8,
    backgroundColor: '#e0e8ff',
  },
  messageContent: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
  },
  ownMessageContent: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontWeight: '600',
    marginRight: 6,
  },
  zodiacContainer: {
    
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 11,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    margin: 0,
  },
});