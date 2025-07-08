
"use client";

import { useState, useRef, useEffect, type ReactNode, useCallback } from 'react';
import type { DailyChallenge } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Music, ListMusic, Inbox } from 'lucide-react';
import { cn, formatDisplayDate } from '@/lib/utils';

interface PlaylistPlayerProps {
  songs: DailyChallenge[];
  title: string;
  description?: string;
  headerActions?: ReactNode;
  emptyState?: ReactNode;
}

export function PlaylistPlayer({ songs, title, description, headerActions, emptyState }: PlaylistPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentSong = songs[currentIndex];

  // This useCallback handles changing the track and initiating playback.
  // It's designed to be called directly from user interaction handlers.
  const playTrack = useCallback((index: number) => {
    const audio = audioRef.current;
    if (audio && songs[index]) {
      setCurrentIndex(index);
      // We set the src and play directly to keep the user gesture context.
      if (audio.src !== songs[index].songUrl) {
          audio.src = songs[index].songUrl;
      }
      audio.play().catch(e => console.error("Playback was prevented:", e));
    }
  }, [songs]);

  // Effect to set up Media Session API and event listeners.
  // This is the core of the lock screen functionality.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || songs.length === 0) return;
    
    // Handlers that call our robust playTrack function.
    const nextTrackHandler = () => playTrack((currentIndex + 1) % songs.length);
    const previousTrackHandler = () => playTrack((currentIndex - 1 + songs.length) % songs.length);

    // Set metadata for the *current* song. This runs every time currentIndex changes.
    if (currentSong && 'mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.songTitle,
        artist: 'LoveUnlock',
        album: 'Unlocked Songs',
      });

      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
      navigator.mediaSession.setActionHandler('previoustrack', songs.length > 1 ? previousTrackHandler : null);
      navigator.mediaSession.setActionHandler('nexttrack', songs.length > 1 ? nextTrackHandler : null);
    }

    // --- On-page `onEnded` handler ---
    // This is for when the app is in the foreground.
    const onEndedHandler = () => {
        if (songs.length > 1) {
            nextTrackHandler();
        }
    };
    audio.addEventListener('ended', onEndedHandler);

    // --- Cleanup ---
    return () => {
      audio.removeEventListener('ended', onEndedHandler);
      // It's good practice to clear handlers, though they'll be overwritten on next render.
      if ('mediaSession' in navigator) {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [currentIndex, songs, currentSong, playTrack]); // Re-run when context changes

  // Reset index if songs array changes to avoid out-of-bounds error
  useEffect(() => {
    // Only reset if the new songs array is different.
    setCurrentIndex(0);
  }, [songs]);

  if (songs.length === 0) {
    return (
        <Card className="w-full max-w-2xl mx-auto h-full flex flex-col">
            <CardHeader className="flex-shrink-0 flex flex-row justify-between items-center p-4">
                <div>
                    <CardTitle className="text-2xl font-bold text-primary-foreground">{title}</CardTitle>
                    {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
                </div>
                {headerActions}
            </CardHeader>
            <CardContent className="h-full flex flex-col justify-center items-center">
                {emptyState || (
                    <div className="text-center py-8 flex flex-col justify-center items-center h-full">
                        <Inbox className="mx-auto h-16 w-16 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-lg">No songs in the playlist.</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto flex flex-col shadow-xl border-primary h-full">
      <CardHeader className="flex-shrink-0 flex flex-row justify-between items-center p-4">
        <div>
            <CardTitle className="text-2xl font-bold text-primary-foreground">{title}</CardTitle>
            {description && <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>}
        </div>
        {headerActions}
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 p-4 pt-0 overflow-hidden">
        {/* Player */}
        <div className="flex-shrink-0 p-4 bg-accent/20 rounded-lg flex flex-col items-center gap-2">
            <h3 className="text-lg font-semibold text-accent-foreground truncate w-full text-center">{currentSong.songTitle}</h3>
            <audio
              ref={audioRef}
              controls
              src={currentSong.songUrl} // Set initial src, will be programmatically changed
              className="w-full"
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
                        onClick={() => playTrack(index)} // Click handler now uses playTrack
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
