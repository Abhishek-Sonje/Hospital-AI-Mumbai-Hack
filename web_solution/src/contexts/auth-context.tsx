"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUser, createUser } from '@/lib/firestore-helpers';
import { AppUser, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  appUser: AppUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AuthProvider] Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AuthProvider] Auth state changed:', firebaseUser ? `User: ${firebaseUser.email}` : 'No user');
      setUser(firebaseUser);
      
      if (firebaseUser) {
        console.log('[AuthProvider] Fetching user data from Firestore for UID:', firebaseUser.uid);
        
        let userData: AppUser | null = null;
        
        try {
          // Try to fetch user data with a 2-second timeout
          userData = await Promise.race([
            getUser(firebaseUser.uid),
            new Promise<null>((_, reject) => 
              setTimeout(() => reject(new Error('Firestore timeout')), 2000)
            )
          ]);
          
          if (userData) {
            console.log('[AuthProvider] User data fetched successfully:', userData);
            setAppUser(userData);
          } else {
            throw new Error('No user data returned');
          }
        } catch (error: any) {
          console.warn('[AuthProvider] Failed to fetch user data:', error.message);
          console.log('[AuthProvider] Using fallback user data');
          
          // Create a minimal user object from Firebase auth data
          const fallbackUser: AppUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            role: 'hospital' as UserRole, // Default to hospital for demo
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
            createdAt: new Date().toISOString(),
          };
          console.log('[AuthProvider] Fallback user:', fallbackUser);
          setAppUser(fallbackUser);
        }
      } else {
        console.log('[AuthProvider] No Firebase user, clearing appUser');
        setAppUser(null);
      }
      
      setLoading(false);
      console.log('[AuthProvider] Loading complete');
    });

    return () => {
      console.log('[AuthProvider] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] signIn called for:', email);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log('[AuthProvider] signIn successful:', result.user.email);
    } catch (error) {
      console.error('[AuthProvider] signIn error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole, displayName?: string) => {
    console.log('[AuthProvider] signUp called for:', email, 'with role:', role);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('[AuthProvider] Firebase user created:', userCredential.user.email);
      
      // Create user document in Firestore
      await createUser(userCredential.user.uid, {
        email: userCredential.user.email,
        role,
        displayName,
        createdAt: new Date().toISOString(),
      });
      console.log('[AuthProvider] User document created in Firestore');
    } catch (error) {
      console.error('[AuthProvider] signUp error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] signOut called');
    try {
      await firebaseSignOut(auth);
      console.log('[AuthProvider] signOut successful');
    } catch (error) {
      console.error('[AuthProvider] signOut error:', error);
      throw error;
    }
  };

  const value = {
    user,
    appUser,
    loading,
    signIn,
    signUp,
    signOut,
  };

  console.log('[AuthProvider] Current state - user:', user?.email, 'appUser:', appUser?.email, 'loading:', loading);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function useRequireAuth(requiredRole?: UserRole) {
  const { appUser, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !appUser) {
      window.location.href = '/auth/login';
    }
    
    if (!loading && appUser && requiredRole && appUser.role !== requiredRole) {
      // Redirect to appropriate dashboard
      window.location.href = `/${appUser.role}`;
    }
  }, [appUser, loading, requiredRole]);
  
  return { appUser, loading };
}
