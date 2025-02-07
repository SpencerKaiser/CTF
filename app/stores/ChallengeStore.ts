import axios from 'axios';
import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
import { Challenge } from '@/src/types/Challenge';

type CTFResponse = {
  challenges: Challenge[];
};

type ChallengeStore = {
  challenges: Challenge[];
  isLoading: boolean;
  updateChallenges: () => void;
};

let previousChallenges: Challenge[] = [];

const diffChallengesAndGenerateNotificationMessages = (
  updatedChallenges: Challenge[]
): string[] => {
  if (!previousChallenges.length) {
    previousChallenges = updatedChallenges;
    return [];
  }

  const messages = updatedChallenges.reduce<string[]>((acc, updatedChallenge) => {
    const previousChallenge = previousChallenges.find(
      (challenge) => challenge.title === updatedChallenge.title
    );
    const { numTasksAccomplished: oldNumTasksAccomplished } = previousChallenge ?? {};
    const { numTasks: newNumTasks, numTasksAccomplished: newNumTasksAccomplished } =
      updatedChallenge;

    if (newNumTasksAccomplished > (oldNumTasksAccomplished ?? 0)) {
      const isFinished = newNumTasksAccomplished === newNumTasks;
      return [
        ...acc,
        isFinished
          ? `Challenge "${updatedChallenge.title}" was completed! 🚀`
          : `You made progress on "${updatedChallenge.title}"! 👀`,
      ];
    }

    return acc;
  }, []);

  previousChallenges = updatedChallenges;

  return messages;
};

export const useChallengeStore = create<ChallengeStore>((set) => ({
  challenges: [],
  isLoading: true, // Only set on initial load
  updateChallenges: () => {
    const fetchAndSetChallenges = async () => {
      try {
        const {
          data: { challenges: updatedChallenges },
        } = await axios.get<CTFResponse>('/api/ctf');

        set({ challenges: updatedChallenges });
        diffChallengesAndGenerateNotificationMessages(updatedChallenges).forEach((message) => {
          notifications.show({
            message,
            position: 'top-center',
            autoClose: 10 * 1000,
            color: 'green',
          });
        });
      } catch (err) {
        alert('Unexpected error occurred...');
      }
      set({ isLoading: false });
    };

    void fetchAndSetChallenges();
  },
}));
