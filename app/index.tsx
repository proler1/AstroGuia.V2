import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { isAuthenticated, isOnboarded, isLoading } = useAuth();

  // While checking auth state, show nothing (the splash screen will be showing)
  if (isLoading) return null;
  
  // If not authenticated, redirect to login screen
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }
  
  // If authenticated but not onboarded, redirect to onboarding
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }
  
  // If authenticated and onboarded, redirect to the main app
  return <Redirect href="/(tabs)" />;
}