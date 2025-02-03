import fs from 'fs';
import { Challenges } from '@/src/types/Challenge';
import { challengeProgressPath } from './shared';

export const writeChallengeProgress = async (challenges: Challenges) => {
  await fs.promises.writeFile(challengeProgressPath, JSON.stringify(challenges, null, 2));
};
