"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getAllChallenges } from '@/lib/services/firestoreService';
import type { DailyChallenge } from '@/lib/types';
import { PlaylistPlayer } from '@/components/PlaylistPlayer';
import { Loader2 } from 'lucide-react';

export default function PlaylistPage() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [songs, setSongs] = useState<DailyChallenge[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    if (!isAuthLoading) {
      if (!user) {
        router.replace('/admin/login');
      } else {
        const fetchSongs = async () => {
          setIsDataLoading(true);
          const allSongs = await getAllChallenges();
          setSongs(allSongs);
          setIsDataLoading(false);
        };
        fetchSongs();
      }
    }
  }, [user, isAuthLoading, router]);

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

  return (
    <div className="h-screen w-full p-2 sm:p-4 bg-gradient-to-br from-background to-pink-100">
      <PlaylistPlayer songs={songs} />
    </div>
  );
}
