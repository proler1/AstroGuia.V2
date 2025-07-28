import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
  UserCredential 
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../config/firebase';
import { User, BirthDetails, UserPreferences } from '../models/User';

export class AuthService {
  // Create a new user with email and password
  static async registerWithEmailAndPassword(
    email: string,
    password: string,
    displayName: string
  ): Promise<User> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const firebaseUser = userCredential.user;
      
      // Update profile with display name
      await updateProfile(firebaseUser, { displayName });
      
      // Create user document in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        displayName: displayName,
        photoURL: firebaseUser.photoURL,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(firestore, 'users', firebaseUser.uid), newUser);
      
      return newUser;
    } catch (error: any) {
      console.error('Error in registerWithEmailAndPassword:', error);
      throw error;
    }
  }
  
  // Sign in with email and password
  static async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<User> {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      
      const firebaseUser = userCredential.user;
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      } else {
        // If user document doesn't exist yet, create it
        const newUser: User = {
          id: firebaseUser.uid,
          email: firebaseUser.email || email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(doc(firestore, 'users', firebaseUser.uid), newUser);
        
        return newUser;
      }
    } catch (error: any) {
      console.error('Error in signInWithEmailAndPassword:', error);
      throw error;
    }
  }
  
  // Sign out
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Error signing out:', error);
      throw error;
    }
  }
  
  // Send password reset email
  static async sendPasswordResetEmail(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  }
  
  // Get current user from Firestore
  static async getCurrentUser(firebaseUser: FirebaseUser): Promise<User | null> {
    try {
      const userDoc = await getDoc(doc(firestore, 'users', firebaseUser.uid));
      
      if (userDoc.exists()) {
        return userDoc.data() as User;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error getting current user:', error);
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
  
  // Update user profile
  static async updateUserProfile(userId: string, data: Partial<User>): Promise<void> {
    try {
      // Remove id field as it shouldn't be updated
      const { id, ...updateData } = data;
      
      await updateDoc(doc(firestore, 'users', userId), updateData);
      
      // Update Firebase Auth profile if display name or photo URL is provided
      if (auth.currentUser && (data.displayName || data.photoURL)) {
        await updateProfile(auth.currentUser, {
          displayName: data.displayName || auth.currentUser.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL,
        });
      }
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
}