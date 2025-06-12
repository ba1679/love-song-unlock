"use client";

import { useState, useEffect, useCallback } from 'react';
import type { DailyChallenge } from '@/lib/types';
import { getDailyChallenge } from '@/lib/services/firestoreService';
import { getTodayDateString, sha256 } from '@/lib/utils';
import { QuestionCard } from './QuestionCard';
import { SongPlayer } from './SongPlayer';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, HeartCrack, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


export default function DailyChallengeView() {
  const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUnlockedToday, setIsUnlockedToday] = useState(false);
  const [feedback, setFeedback] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const todayDateStr = getTodayDateString();
  const localStorageKey = `loveUnlock_${todayDateStr}`;

  const loadChallenge = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const storedUnlockStatus = typeof window !== 'undefined' ? localStorage.getItem(localStorageKey) : null;
      if (storedUnlockStatus === 'true') {
        setIsUnlockedToday(true);
      }

      const fetchedChallenge = await getDailyChallenge(todayDateStr);
      if (fetchedChallenge) {
        setChallenge(fetchedChallenge);
      } else {
        setError("今天沒有挑戰了，我們直接見面吧😚");
      }
    } catch (err) {
      console.error("Failed to load challenge:", err);
      setError("Could not load today's challenge. Please try again later.");
      toast({
        title: "Error",
        description: "Failed to fetch challenge data. Please check your connection.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [todayDateStr, localStorageKey, toast]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handleAnswerSubmit = async (answer: string) => {
    if (!challenge) return;

    setIsSubmitting(true);
    setFeedback(undefined);

    try {
      const userAnswerHash = await sha256(answer);
      if (userAnswerHash === challenge.answerHash) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(localStorageKey, 'true');
        }
        setIsUnlockedToday(true);
        setFeedback("答對啦! 🎉 可以聽歌囉～");
        toast({
          title: "Success!",
          description: "寶貝真棒🩷",
        });
      } else {
        setFeedback("娃 答錯了，再試一次！ ❤️");
        toast({
          title: "Oops!",
          description: "再想想一下，想不到再來問我吧😆",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Error hashing answer:", e);
      setFeedback("An error occurred. Please try again.");
      toast({
        title: "Error",
        description: "Something went wrong while checking your answer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <Skeleton className="h-10 w-3/4 max-w-md mb-4" />
        <Skeleton className="h-8 w-1/2 max-w-xs" />
        <p className="text-muted-foreground mt-4">用愛努力載入中...</p>
      </div>
    );
  }

  if (error && !challenge) { 
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <Alert variant="destructive" className="w-full max-w-md">
          <HeartCrack className="h-5 w-5" />
          <AlertTitle>Oh no! Something went wrong.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (isUnlockedToday && challenge) {
     return <SongPlayer 
                songTitle={challenge.songTitle} 
                songUrl={challenge.songUrl} 
                memory={challenge.memory} 
            />;
  }
  
  if (challenge) {
     return (
        <QuestionCard
          question={challenge.question}
          onSubmit={handleAnswerSubmit}
          feedbackMessage={feedback}
          isSubmitting={isSubmitting}
        />
      );
  }

  // This handles the "No challenge available for today" case specifically when error is set for it.
  // Or if fetching simply returned null for challenge without an actual catch block error.
  if (!challenge) {
    return (
        <div className="flex flex-col items-center justify-center p-4">
          <Alert className="w-full max-w-md border-accent">
            <Terminal className="h-5 w-5 text-accent" />
            <AlertTitle className="text-accent-foreground">No Challenge Today</AlertTitle>
            <AlertDescription>
              {error || "It seems there's no love puzzle set for today. Please check back tomorrow for a new song to unlock!"}
            </AlertDescription>
          </Alert>
        </div>
    );
  }

  // Fallback, though ideally all states are covered above
  return null;
}
