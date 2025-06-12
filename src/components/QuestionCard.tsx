"use client";

import type * as React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Heart } from 'lucide-react';

interface QuestionCardProps {
  question: string;
  onSubmit: (answer: string) => void;
  feedbackMessage?: string;
  isSubmitting?: boolean;
}

export function QuestionCard({ question, onSubmit, feedbackMessage, isSubmitting }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(answer);
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl animate-gentle-fade-in border-primary">
      <CardHeader className="text-center p-4 sm:p-6">
        <div className="flex justify-center items-center mb-2 sm:mb-3">
          <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-primary fill-primary/20" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold text-primary-foreground">每日問答</CardTitle>
        <CardDescription className="text-muted-foreground text-sm sm:text-base">答對就可以解鎖一首我為妳準備的歌哦🎙️</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1.5">
            <p className="text-base sm:text-lg text-center font-medium text-foreground">{question}</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="answer" className="text-foreground">妳的答案：</Label>
            <Input
              id="answer"
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="在這裡回答..."
              required
              className="bg-background/80 focus:ring-accent"
            />
          </div>
          {feedbackMessage && (
            <p className={`text-sm text-center ${feedbackMessage.includes("Correct") || feedbackMessage.includes("unlocked") ? "text-green-600" : "text-destructive"}`}>
              {feedbackMessage}
            </p>
          )}
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
            {isSubmitting ? '檢查中...' : '解鎖'}
            <Heart className="ml-2 h-4 w-4 fill-current" />
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground p-4 pt-2 sm:pt-3">
        <p>From Te Puke to Forever</p>
      </CardFooter>
    </Card>
  );
}
