"use client";

import { createContext, useContext, useEffect, useState, useMemo, type ReactNode } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { getAuth } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, isLoading: true });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 使用 lazy initialization 獲取 auth 實例
    let auth;
    try {
      auth = getAuth();
    } catch (error) {
      console.error('Firebase auth is not initialized:', error);
      setIsLoading(false);
      return;
    }

    // 設置超時機制，避免永遠卡在 loading
    const timeoutId = setTimeout(() => {
      setIsLoading((prev) => {
        if (prev) {
          console.warn('Auth state check timeout');
          return false;
        }
        return prev;
      });
    }, 10000); // 10 秒超時

    // onAuthStateChanged 返回一個取消訂閱的函數
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        setIsLoading(false);
        clearTimeout(timeoutId);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setIsLoading(false);
        clearTimeout(timeoutId);
      }
    );

    // 清理：取消訂閱和清除超時
    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  const value = useMemo(() => ({ user, isLoading }), [user, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
