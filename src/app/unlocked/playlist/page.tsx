"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getDailyChallenge } from '@/lib/services/firestoreService';
import type { DailyChallenge } from '@/lib/types';
import { PlaylistPlayer } from '@/components/PlaylistPlayer';
import { Loader2, Home, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function UnlockedPlaylistPage() {
  const [songs, setSongs] = useState<DailyChallenge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnlockedSongs = async () => {
      setIsLoading(true);
      setError(null);
      const unlockedSongs: DailyChallenge[] = [];
      const unlockedDates: string[] = [];

      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('loveUnlock_') && localStorage.getItem(key) === 'true') {
              const dateStr = key.substring('loveUnlock_'.length);
              unlockedDates.push(dateStr);
            }
          }
        }

        if (unlockedDates.length === 0) {
          setIsLoading(false);
          return;
        }
        
        unlockedDates.sort((a, b) => b.localeCompare(a)); // Sort by date descending

        const songPromises = unlockedDates.map(dateStr => getDailyChallenge(dateStr));
        const results = await Promise.all(songPromises);
        
        results.forEach(challenge => {
          if (challenge) {
            unlockedSongs.push(challenge);
          }
        });
        
        setSongs(unlockedSongs);
      } catch (err) {
        console.error("Failed to load unlocked songs:", err);
        setError("Could not load your unlocked songs. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUnlockedSongs();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading Your Playlist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background p-4">
         <Alert variant="destructive" className="w-full max-w-md">
          <AlertTitle>Error Loading Playlist</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button asChild variant="secondary" className="mt-4">
            <Link href="/">Back to Home</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  const headerActions = (
    <Button asChild variant="outline">
      <Link href="/">
        <Home className="mr-2 h-4 w-4" />
        Home
      </Link>
    </Button>
  );

  const emptyState = (
    <div className="text-center py-8 flex flex-col justify-center items-center h-full">
        <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-3" />
        <p className="text-muted-foreground text-lg">No songs unlocked yet.</p>
        <p className="text-muted-foreground mt-1 text-sm">Go unlock today's song to start your playlist!</p>
        <Button asChild variant="link" className="mt-4">
          <Link href="/unlocked">View Unlocked List</Link>
        </Button>
    </div>
  );

  return (
    <div className="h-screen w-full p-2 sm:p-4 bg-gradient-to-br from-background to-pink-100">
      <PlaylistPlayer 
        songs={songs} 
        title="已解鎖播放清單"
        description="Your collection of unlocked love songs."
        headerActions={headerActions}
        emptyState={emptyState}
      />
    </div>
  );
}
