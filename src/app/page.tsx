import DailyChallengeView from "@/components/DailyChallengeView";
import { Button } from "@/components/ui/button";
import { Heart, ListMusic } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-2 sm:py-4 flex flex-col items-center justify-around h-full bg-gradient-to-br from-background to-pink-100 dark:from-background dark:to-purple-900">
      <header className="mt-2 sm:mt-0 mb-1 sm:mb-2 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground flex items-center justify-center">
          <Heart className="w-8 h-8 sm:w-12 sm:h-12 mr-1 sm:mr-3 text-primary fill-primary/30" />
          The song, Our story
          <Heart className="w-8 h-8 sm:w-12 sm:h-12 ml-1 sm:ml-3 text-primary fill-primary/30" />
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-lg">Unlock a new song for your love every day!</p>
      </header>
      <div className="w-full flex justify-center my-1 sm:my-2">
        <DailyChallengeView />
      </div>
      <div className="flex flex-col items-center gap-4 mb-1 sm:mb-0 mt-1 sm:mt-2">
        <Button asChild variant="outline" className="bg-accent/30 hover:bg-accent/50 border-accent text-accent-foreground">
          <Link href="/unlocked">
            <ListMusic className="mr-2 h-5 w-5" />
            已解鎖的歌曲
          </Link>
        </Button>
        <Link href="/admin/login" className="text-xs text-muted-foreground hover:underline">
          Admin Login
        </Link>
      </div>
    </div>
  );
}
