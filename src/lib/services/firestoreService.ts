import { getFirestore, doc, getDoc, collection } from 'firebase/firestore';
import { app } from '@/lib/firebase'; // Firebase app instance
import type { DailyChallenge } from '@/lib/types';

let db: any; // Delay initialization until app is available
if (app) {
  db = getFirestore(app);
}


export async function getDailyChallenge(dateStr: string): Promise<DailyChallenge | null> {
  if (!db) {
    console.warn("Firestore not initialized. App might be running on server or Firebase config missing.");
    // Attempt to initialize if called on client and not yet done (e.g. due to conditional app init)
    if (typeof window !== 'undefined' && app) {
        db = getFirestore(app);
    } else {
        return null;
    }
  }
  const challengesCollectionRef = collection(db, 'dailyChallenges');
  try {
    const docRef = doc(challengesCollectionRef, dateStr);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DailyChallenge;
    } else {
      console.log("No challenge document found for date:", dateStr);
      return null;
    }
  } catch (error) {
    console.error("Error fetching daily challenge from Firestore:", error);
    // Consider throwing a custom error or returning a specific error object
    return null;
  }
}
