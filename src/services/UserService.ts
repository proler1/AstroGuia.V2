import { doc, updateDoc, getDoc, getDocs, collection, query, where, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firestore, storage } from '../config/firebase';
import { User, BirthDetails, UserPreferences } from '../models/User';

export class UserService {
  // Get user by ID
  static async getUserById(userId: string): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      
      return null;
    } catch (error: any) {
      console.error(`Error getting user ${userId}:`, error);
      throw error;
    }
  }
  
  // Update user profile information
  static async updateUserProfile(userId: string, userData: Partial<User>): Promise<void> {
    try {
      // Remove id field as it shouldn't be updated
      const { id, ...updateData } = userData;
      
      await updateDoc(doc(firestore, 'users', userId), updateData);
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
  
  // Upload user profile image
  static async uploadProfileImage(userId: string, imageUri: string): Promise<string> {
    try {
      // For React Native, we need to fetch the image first
      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      // Create reference to the storage location
      const storageRef = ref(storage, `profile_images/${userId}`);
      
      // Upload the file
      await uploadBytes(storageRef, blob);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      // Update user profile with new photo URL
      await updateDoc(doc(firestore, 'users', userId), {
        photoURL: downloadURL
      });
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  }
  
  // Update user birth details
  static async updateBirthDetails(userId: string, birthDetails: BirthDetails): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), { birthDetails });
    } catch (error: any) {
      console.error('Error updating birth details:', error);
      throw error;
    }
  }
  
  // Update user preferences
  static async updateUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), { preferences });
    } catch (error: any) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }
  
  // Get users by zodiac sign
  static async getUsersByZodiacSign(sign: string): Promise<User[]> {
    try {
      const usersQuery = query(
        collection(firestore, 'users'),
        where('birthDetails.zodiacSign', '==', sign)
      );
      
      const userDocs = await getDocs(usersQuery);
      
      if (!userDocs.empty) {
        return userDocs.docs.map(doc => doc.data() as User);
      }
      
      return [];
    } catch (error: any) {
      console.error(`Error getting users with zodiac sign ${sign}:`, error);
      throw error;
    }
  }
  
  // Save user favorites (articles, horoscopes, etc.)
  static async saveFavorite(userId: string, itemType: string, itemId: string): Promise<void> {
    try {
      const favoriteRef = doc(firestore, 'userFavorites', `${userId}_${itemType}_${itemId}`);
      
      await setDoc(favoriteRef, {
        userId,
        itemType,
        itemId,
        createdAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error saving favorite:', error);
      throw error;
    }
  }
  
  // Remove user favorite
  static async removeFavorite(userId: string, itemType: string, itemId: string): Promise<void> {
    try {
      const favoriteRef = doc(firestore, 'userFavorites', `${userId}_${itemType}_${itemId}`);
      
      await updateDoc(favoriteRef, {
        deleted: true,
        deletedAt: new Date().toISOString()
      });
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }
  
  // Get user favorites by type
  static async getUserFavorites(userId: string, itemType: string): Promise<string[]> {
    try {
      const favoritesQuery = query(
        collection(firestore, 'userFavorites'),
        where('userId', '==', userId),
        where('itemType', '==', itemType),
        where('deleted', '==', false)
      );
      
      const favoriteDocs = await getDocs(favoritesQuery);
      
      if (!favoriteDocs.empty) {
        return favoriteDocs.docs.map(doc => doc.data().itemId);
      }
      
      return [];
    } catch (error: any) {
      console.error(`Error getting user favorites for ${itemType}:`, error);
      return [];
    }
  }
  
  // Complete onboarding process
  static async completeOnboarding(userId: string, birthDetails: BirthDetails, preferences: UserPreferences): Promise<void> {
    try {
      await updateDoc(doc(firestore, 'users', userId), {
        birthDetails,
        preferences,
        hasCompletedOnboarding: true
      });
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  }
  
  // Check if user has completed onboarding
  static async hasCompletedOnboarding(userId: string): Promise<boolean> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', userId));
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        return userData.hasCompletedOnboarding || false;
      }
      
      return false;
    } catch (error: any) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  }
}