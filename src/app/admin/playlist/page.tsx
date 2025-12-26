"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllChallenges } from '@/lib/services/firestoreService';
import type { DailyChallenge } from '@/lib/types';
import { PlaylistPlayer } from '@/components/PlaylistPlayer';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function PlaylistPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<DailyChallenge[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (user) {
      const fetchSongs = async () => {
        try {
          setIsDataLoading(true);
          const allSongs = await getAllChallenges();
          // Sort songs by date descending
          const sortedSongs = [...allSongs].sort((a, b) => b.id.localeCompare(a.id));
          setSongs(sortedSongs);
        } catch (error) {
          console.error('Error fetching songs:', error);
        } finally {
          setIsDataLoading(false);
        }
      };
      fetchSongs();
    } else {
      router.replace('/');
    }
  }, [user, isAuthLoading, router]);

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
      }
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (isAuthLoading || (user && isDataLoading)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Playlist...</p>
        </div>
      </div>
    );
  }

  // This check is for after loading, if the user is somehow null, it prevents rendering before redirect.
  if (!user) {
    return null; 
  }
  
  const adminHeaderActions = (
    <Button variant="outline" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Log Out
    </Button>
  );

  return (
    <div className="h-screen w-full p-2 sm:p-4 bg-gradient-to-br from-background to-pink-100">
      <PlaylistPlayer 
        songs={songs} 
        title="Song Playlist"
        description="Admin View"
        headerActions={adminHeaderActions}
      />
    </div>
  );
}
