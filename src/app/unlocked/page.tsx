"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getDailyChallenge } from '@/lib/services/firestoreService';
import type { DailyChallenge } from '@/lib/types';
import { formatDisplayDate } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Music2, ListChecks, ChevronRight, CalendarDays, Loader2, Inbox } from 'lucide-react';

interface UnlockedSongInfo extends DailyChallenge {
  displayDate: string;
}

export default function UnlockedSongsPage() {
  const [unlockedSongs, setUnlockedSongs] = useState<UnlockedSongInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUnlockedSongs = async () => {
      setIsLoading(true);
      setError(null);
      const songInfos: UnlockedSongInfo[] = [];
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
        
        unlockedDates.sort((a, b) => b.localeCompare(a));


        for (const dateStr of unlockedDates) {
          const challenge = await getDailyChallenge(dateStr);
          if (challenge) {
            songInfos.push({
              ...challenge,
              displayDate: formatDisplayDate(challenge.id),
            });
          } else {
            console.warn(`Could not fetch challenge details for unlocked date: ${dateStr}`);
          }
        }
        setUnlockedSongs(songInfos);
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
      <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-semibold mb-2 text-primary-foreground">Loading Unlocked Songs...</h2>
        <div className="w-full max-w-2xl space-y-4 mt-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-center h-full">
        <Alert variant="destructive" className="w-full max-w-md">
          <Music2 className="h-5 w-5" />
          <AlertTitle>Error Loading Songs</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4 h-full flex flex-col">
      <Card className="w-full max-w-2xl mx-auto shadow-xl border-primary flex flex-col flex-grow">
        <CardHeader className="text-center shrink-0 p-3 sm:p-4">
          <div className="flex justify-center items-center mb-1 sm:mb-2">
            <ListChecks className="w-10 h-10 sm:w-12 sm:h-12 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary-foreground">妳已解鎖的歌曲🎶</CardTitle>
          <CardDescription className="text-muted-foreground text-sm sm:text-base">
            Here's a list of all the special songs you've unlocked.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow overflow-y-auto p-3 pt-0 sm:p-4 sm:pt-0">
          {unlockedSongs.length === 0 ? (
            <div className="text-center py-4 sm:py-8 flex flex-col justify-center items-center h-full">
              <Inbox className="mx-auto h-12 w-12 sm:h-16 sm:h-16 text-muted-foreground mb-2 sm:mb-3" />
              <p className="text-muted-foreground text-base sm:text-lg">No songs unlocked yet.</p>
              <p className="text-muted-foreground mt-1 text-sm sm:text-base">Go back to the homepage to unlock today's song!</p>
              <Button asChild variant="link" className="mt-2 sm:mt-3 text-accent-foreground">
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-2 sm:space-y-3">
              {unlockedSongs.map((song) => (
                <li key={song.id} className="animate-gentle-fade-in">
                  <Button
                    asChild
                    variant="ghost"
                    className="w-full justify-between h-auto py-2.5 px-3 sm:py-3 sm:px-4 rounded-lg hover:bg-accent/20 group"
                  >
                    <Link href={`/unlocked/${song.id}`}>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <Music2 className="h-5 w-5 sm:h-6 sm:h-6 text-accent flex-shrink-0" />
                        <div className="text-left">
                          <p className="font-semibold text-sm sm:text-base text-foreground group-hover:text-accent-foreground">{song.songTitle}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground flex items-center">
                            <CalendarDays className="mr-1 h-3 w-3 sm:mr-1.5 sm:h-3.5 sm:h-3.5" />
                            Unlocked on: {song.displayDate}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 sm:h-5 sm:h-5 text-muted-foreground group-hover:text-accent-foreground transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
         {unlockedSongs.length > 0 && (
            <CardFooter className="pt-3 sm:pt-4 justify-center shrink-0 p-3 sm:p-4">
                <Button asChild variant="outline">
                    <Link href="/">返回每日挑戰頁面</Link>
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}
