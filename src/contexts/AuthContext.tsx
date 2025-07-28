import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  Auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { getDatabase, ref, set, get, Database } from 'firebase/database';

// Initialize Firebase with your config
const firebaseConfig = {
  // TODO: Replace with your actual Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "astroguia-app.firebaseapp.com",
  projectId: "astroguia-app",
  storageBucket: "astroguia-app.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isOnboarded: boolean;
  birthDate?: string;
  birthTime?: string;
  birthLocation?: string;
  zodiacSign?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
  completeOnboarding: () => Promise<void>;
  app: FirebaseApp;
  auth: Auth;
  db: Database;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);

  // Check authentication state on app start
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is authenticated, get additional user data from database
          const userDataRef = ref(db, `users/${firebaseUser.uid}`);
          const snapshot = await get(userDataRef);
          const userData = snapshot.exists() ? snapshot.val() : {};
          
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            isOnboarded: userData.isOnboarded || false,
            birthDate: userData.birthDate,
            birthTime: userData.birthTime,
            birthLocation: userData.birthLocation,
            zodiacSign: userData.zodiacSign,
          });
        } else {
          // No user is authenticated
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      // Initialize user in the database
      await set(ref(db, `users/${newUser.uid}`), {
        email: newUser.email,
        isOnboarded: false,
        createdAt: new Date().toISOString()
      });
      
      // Auth state listener will update the user state
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // Clear local storage
      await AsyncStorage.removeItem('authToken');
      // Auth state listener will handle the rest
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      // Update in Firebase Database
      await set(ref(db, `users/${user.uid}`), {
        ...user,
        ...data
      });
      
      // Update local state
      setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const completeOnboarding = async () => {
    if (!user) throw new Error('No authenticated user');
    
    try {
      await updateUserProfile({ isOnboarded: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isOnboarded: user?.isOnboarded || false,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    completeOnboarding,
    app,
    auth,
    db
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};