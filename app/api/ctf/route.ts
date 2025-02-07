import { Challenge } from '@/src/types/Challenge';
import { readChallengeProgress } from '@/src/utils/challenges/readChallengeProgress';

export const GET = async () => {
  const rawChallenges = await readChallengeProgress();

  const challenges: Challenge[] = Object.entries(rawChallenges).map(([title, challenge]) => ({
    title,
    description: challenge.description,
    numTasks: Object.keys(challenge.tasks).length,
    numTasksAccomplished: Object.values(challenge.tasks).filter(Boolean).length,
    ...('showTitleAsCode' in challenge && challenge.showTitleAsCode
      ? { showTitleAsCode: true }
      : {}),
  }));

  return new Response(JSON.stringify({ challenges, hint: '/ctf/secrets' }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
