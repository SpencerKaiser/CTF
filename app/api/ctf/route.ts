import { readChallengeProgress } from '@/src/utils/challenges/readChallengeProgress';

export const GET = async () => {
  const rawChallenges = await readChallengeProgress();

  const challenges = Object.entries(rawChallenges).map(([title, challenge]) => ({
    title,
    description: challenge.description,
    numTasks: Object.keys(challenge.tasks).length,
    numTasksAccomplished: Object.values(challenge.tasks).filter(Boolean).length,
  }));

  return Response.json(challenges);
};
