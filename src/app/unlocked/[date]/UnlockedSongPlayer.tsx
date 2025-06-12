"use client";

import { useEffect, useState } from 'react';
import { SongPlayer } from '@/components/SongPlayer';
import type { DailyChallenge } from '@/lib/types';
import { getDailyChallenge } from '@/lib/services/firestoreService';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { HeartCrack, Lock, Loader2 } from 'lucide-react';
import Link from 'next/link';


export default function UnlockedSongPlayer({dateProps}: {dateProps: string}) {
  const date = typeof dateProps === 'string' ? dateProps : undefined;

  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (!date) {
      setError("Invalid date parameter.");
      setIsLoading(false);
      return;
    }

    const verifyAndLoad = async () => {
      setIsLoading(true);
      setError(null);

      const localStorageKey = `loveUnlock_${date}`;
      if (typeof window !== 'undefined' && window.localStorage) {
        const isUnlocked = localStorage.getItem(localStorageKey) === 'true';
        if (!isUnlocked) {
          setError("This song is not unlocked yet or access is denied.");
          setIsVerified(false);
          setIsLoading(false);
          return;
        }
        setIsVerified(true);
      } else {
         setError("Cannot verify unlock status. Local storage not available.");
         setIsVerified(false);
         setIsLoading(false);
         return;
      }
      

      try {
        const fetchedChallenge = await getDailyChallenge(date);
        if (fetchedChallenge) {
          setChallenge(fetchedChallenge);
        } else {
          setError("Could not find song details for this date.");
        }
      } catch (err) {
        console.error("Failed to load challenge for song player:", err);
        setError("Could not load song details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAndLoad();
  }, [date]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-8 w-1/2 max-w-xs" />
         <p className="text-muted-foreground mt-4">Loading your song...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full">
        <Alert variant="destructive" className="w-full max-w-md text-center">
          {isVerified ? <HeartCrack className="h-6 w-6 mx-auto mb-2" /> : <Lock className="h-6 w-6 mx-auto mb-2" />}
          <AlertTitle>{isVerified ? "Error Loading Song" : "Access Denied"}</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/unlocked">Back to Unlocked Songs</Link>
          </Button>
        </Alert>
      </div>
    );
  }

  if (!challenge) {
    return (
      <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full">
        <Alert variant="destructive" className="w-full max-w-md text-center">
          <HeartCrack className="h-6 w-6 mx-auto mb-2" />
          <AlertTitle>Song Not Found</AlertTitle>
          <AlertDescription>The details for this song could not be found.</AlertDescription>
           <Button asChild variant="outline" className="mt-6">
            <Link href="/unlocked">Back to Unlocked Songs</Link>
          </Button>
        </Alert>
      </div>
    );
  }
  
  if (!isVerified) {
     return null;
  }

  return (
    <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full gap-1 sm:gap-2 bg-gradient-to-br from-background to-pink-100 dark:from-background dark:to-purple-900">
        <SongPlayer 
            songTitle={challenge.songTitle} 
            songUrl={challenge.songUrl} 
            memory={challenge.memory}
        />
        <Button asChild variant="link" className="text-accent-foreground hover:text-accent-foreground/80">
            <Link href="/unlocked">
                返回已解鎖歌曲
            </Link>
        </Button>
    </div>
  );
}
