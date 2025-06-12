import UnlockedSongPlayer from './UnlockedSongPlayer';

export async function generateStaticParams() {
  return [
    { date: '20250801' }, // Example: pre-renders /unlocked/20250801.html
    { date: '20250802' }, // Example: pre-renders /unlocked/20250802.html
    // Add more specific dates here if they are known at build time,
    // or implement logic to fetch all existing challenge dates.
  ];
}


export default function UnlockedSongPlayerPage({
  params,
}: {
  params: { date: string }
}) {
  return <UnlockedSongPlayer dateProps={params.date} />
}
