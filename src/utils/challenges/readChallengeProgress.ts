import fs from 'fs';
import cloneDeep from 'clone-deep';
import { Challenges, defaultChallenges } from '@/src/types/Challenge';
import { challengeProgressPath } from './shared';
import { writeChallengeProgress } from './writeChallengeProgress';

export const readChallengeProgress = async (): Promise<Challenges> => {
  try {
    const rawChallenges = await fs.promises.readFile(challengeProgressPath);
    if (!rawChallenges) {
      throw new Error('Blank challenges');
    }
    return JSON.parse(rawChallenges.toString());
  } catch (err) {
    console.warn('Failed to load challenges; reinitializing...');
    const newChallenges = cloneDeep(defaultChallenges);
    await writeChallengeProgress(newChallenges);
    return newChallenges;
  }
};
