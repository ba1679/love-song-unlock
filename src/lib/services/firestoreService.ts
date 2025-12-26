import { getFirestore, doc, getDoc, collection, getDocs, query, type Firestore } from 'firebase/firestore';
import { getApp } from '@/lib/firebase'; // Firebase app instance
import type { DailyChallenge } from '@/lib/types';

let db: Firestore | undefined; // Lazy initialization

/**
 * Get Firestore instance (lazy initialization)
 * Only initializes on the client side when first called
 */
function getDb(): Firestore | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (!db) {
    try {
      const app = getApp();
      db = getFirestore(app);
    } catch (error) {
      console.error('Failed to initialize Firestore:', error);
      return null;
    }
  }

  return db;
}

export async function getDailyChallenge(dateStr: string): Promise<DailyChallenge | null> {
  const firestore = getDb();
  if (!firestore) {
    console.warn("Firestore not initialized. This function can only be called on the client side.");
    return null;
  }
  const challengesCollectionRef = collection(firestore, 'dailyChallenges');
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

export async function getAllChallenges(): Promise<DailyChallenge[]> {
  const firestore = getDb();
  if (!firestore) {
    console.warn("Firestore not initialized. This function can only be called on the client side.");
    return [];
  }
  const challengesCollectionRef = collection(firestore, 'dailyChallenges');
  // Order by document ID (which is the date string 'YYYYMMDD') in descending order to get latest first
  const q = query(challengesCollectionRef);

  try {
    const querySnapshot = await getDocs(q);
    const challenges: DailyChallenge[] = [];
    querySnapshot.forEach((doc) => {
      challenges.push({ id: doc.id, ...doc.data() } as DailyChallenge);
    });
    return challenges;
  } catch (error) {
    console.error("Error fetching all challenges from Firestore:", error);
    return [];
  }
}
