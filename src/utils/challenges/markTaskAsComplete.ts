import { Challenges, ChallengeTasks, ChallengeTitle } from '@/src/types/Challenge';
import { readChallengeProgress } from './readChallengeProgress';
import { writeChallengeProgress } from './writeChallengeProgress';

let challengeCache: Challenges | undefined;

type MarkTaskAsCompleteArgs<T extends ChallengeTitle> = {
  challengeTitle: T;
  challengeTask: ChallengeTasks<T>;
};

export const markTaskAsComplete = async <T extends ChallengeTitle>({
  challengeTitle,
  challengeTask,
}: MarkTaskAsCompleteArgs<T>) => {
  if (!challengeCache) {
    // Initialize the cache if it doesn't exist
    challengeCache = await readChallengeProgress();
  }

  const wasPreviouslyCompleted = challengeCache[challengeTitle].tasks[challengeTask];

  if (wasPreviouslyCompleted) return;

  challengeCache[challengeTitle].tasks[challengeTask] = true;
  await writeChallengeProgress(challengeCache);
};
