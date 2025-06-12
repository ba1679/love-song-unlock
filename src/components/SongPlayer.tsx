"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PartyPopper, Music2, Cherry } from 'lucide-react';

interface SongPlayerProps {
  songTitle: string;
  songUrl: string;
  memory?: string;
}

export function SongPlayer({ songTitle, songUrl, memory }: SongPlayerProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center shadow-xl animate-gentle-fade-in border-primary">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex justify-center items-center mb-2 sm:mb-3">
          <PartyPopper className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary-foreground">歌曲已解鎖！</CardTitle>
        <CardDescription className="text-muted-foreground text-sm sm:text-base">妳已成功回答問題，明天再來解鎖新的驚喜吧！❤️</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="p-3 sm:p-4 bg-accent/20 rounded-lg">
          <Music2 className="w-8 h-8 sm:w-10 sm:h-10 mx-auto text-accent mb-1 sm:mb-2" />
          <h3 className="text-base sm:text-lg font-semibold text-accent-foreground">{songTitle}</h3>
        </div>
        
        {songUrl ? (
          <div className="px-1 sm:px-0">
            <audio 
              controls 
              src={songUrl} 
              className="w-full rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-accent"
              preload="metadata"
            >
              您的瀏覽器不支援音訊播放功能。
            </audio>
          </div>
        ) : (
          <p className="text-destructive text-center text-sm">歌曲連結遺失或無效，無法播放。</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center text-xs text-muted-foreground p-4 pt-2 sm:pt-3 space-y-1">
         <Cherry className="w-5 h-5 sm:w-6 sm:h-6 text-primary fill-primary/30 mb-0.5 sm:mb-1 flex-shrink-0" />
        <div className="w-full max-h-20 overflow-y-auto px-2 sm:px-4 text-xs sm:text-sm"> 
            {memory ? (
            <p className="text-center">{memory}</p>
            ) : (
            <>
                <p className="text-center">恭喜你！成功解鎖了這首充滿愛意的歌。我愛你！💖</p>
                <p className="mt-0.5 sm:mt-1 text-center">明天再來解鎖新的驚喜吧！</p>
            </>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
