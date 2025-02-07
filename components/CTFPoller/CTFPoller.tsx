'use client';

import { useEffect } from 'react';
import { useChallengeStore } from '@/app/stores/ChallengeStore';
import { useUserStore } from '@/app/stores/UserStore';

const pollingIntervalInSeconds = 3;

export const CTFPoller: React.FC = () => {
  useEffect(() => {
    void useUserStore.getState().init();
  }, []);

  useEffect(() => {
    const interval = setInterval(
      useChallengeStore.getState().updateChallenges,
      pollingIntervalInSeconds * 1000
    );

    return () => clearInterval(interval);
  }, []);

  return null;
};
