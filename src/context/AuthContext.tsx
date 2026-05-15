import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, type User } from 'firebase/auth';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { auth } from '@/src/api/firebaseConfig';
import { logoutUser } from '@/src/services/authService';

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        await AsyncStorage.setItem('auth:lastUserId', currentUser.uid);
      } else {
        await AsyncStorage.removeItem('auth:lastUserId');
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    await AsyncStorage.removeItem('auth:lastUserId');
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      logout,
    }),
    [initializing, logout, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }

  return context;
};
