export interface DailyChallenge {
  id: string; // Date in YYYY-MM-DD format, also Firestore document ID
  question: string;
  answerHash: string; // SHA256 hash of the answer
  songTitle: string;
  songUrl: string;
  memory?: string; // Optional field for a special comment
}
