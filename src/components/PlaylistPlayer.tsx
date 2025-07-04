"use client";

import { useState, useRef, useEffect } from 'react';
import type { DailyChallenge } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, ListMusic, LogOut } from 'lucide-react';
import { cn, formatDisplayDate } from '@/lib/utils';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

interface PlaylistPlayerProps {
  songs: DailyChallenge[];
}

export function PlaylistPlayer({ songs }: PlaylistPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  const currentSong = songs[currentIndex];

  const playNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % songs.length);
  };
  
  // Effect to auto-play when song changes via the list
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.play().catch(e => console.error("Autoplay was prevented:", e));
    }
  }, [currentIndex]);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (!currentSong) {
    return (
        <Card className="w-full max-w-lg mx-auto h-full flex flex-col justify-center items-center">
            <CardHeader>
                <CardTitle>No Songs Available</CardTitle>
            </CardHeader>
            <CardContent>
                <p>There are no songs in the playlist.</p>
            </CardContent>
             <Button variant="outline" onClick={handleLogout} className="m-4">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
            </Button>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col shadow-xl border-primary h-full">
      <CardHeader className="flex-shrink-0 flex flex-row justify-between items-center p-4">
        <div>
            <CardTitle className="text-2xl font-bold text-primary-foreground">Song Playlist</CardTitle>
            <p className="text-sm text-muted-foreground">Admin View</p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
        </Button>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 p-4 pt-0 overflow-hidden">
        {/* Player */}
        <div className="flex-shrink-0 p-4 bg-accent/20 rounded-lg flex flex-col items-center gap-2">
            <h3 className="text-lg font-semibold text-accent-foreground truncate w-full text-center">{currentSong.songTitle}</h3>
            <audio
              ref={audioRef}
              controls
              autoPlay
              src={currentSong.songUrl}
              onEnded={playNext}
              className="w-full"
              key={currentSong.id} // Key is important to force re-render when src changes
            >
             Your browser does not support the audio element.
            </audio>
        </div>
        
        {/* Playlist Scroll Area */}
        <div className="flex-grow flex flex-col overflow-hidden">
            <h4 className="text-base font-semibold mb-2 px-1 flex items-center gap-2 text-muted-foreground"><ListMusic className="h-5 w-5"/> Song List</h4>
            <ScrollArea className="flex-grow border rounded-lg">
                <div className="p-2 space-y-1">
                {songs.map((song, index) => (
                    <button
                        key={song.id}
                        onClick={() => setCurrentIndex(index)}
                        className={cn(
                            "w-full text-left p-2 rounded-md flex justify-between items-center transition-colors",
                            index === currentIndex ? "bg-primary/50 font-semibold" : "hover:bg-accent/20"
                        )}
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            {index === currentIndex ? 
                                <Music className="h-4 w-4 text-primary-foreground flex-shrink-0" /> :
                                <div className="w-4 h-4 flex-shrink-0"></div>
                            }
                            <div className='truncate'>
                                <p className='truncate'>{song.songTitle}</p>
                                <p className="text-xs text-muted-foreground">{formatDisplayDate(song.id)}</p>
                            </div>
                        </div>
                    </button>
                ))}
                </div>
            </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}
