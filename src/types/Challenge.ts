export type Challenge = {
  title: string;
  description: string;
  numTasks: number;
  numTasksAccomplished: number;
};

export type RawChallenge = Omit<Challenge, 'title' | 'numTasks' | 'numTasksAccomplished'> & {
  tasks: Record<string, boolean>;
};

const createChallenges = <T extends Record<string, RawChallenge>>(challenges: T) => challenges;

export const defaultChallenges = createChallenges({
  "We're in...": {
    description: 'Gain access to the system',
    tasks: {
      findUsersEndpoint: false,
      findLimitOrPaginate: false,
      retrieveExpandedUserDetails: false,
      attemptLogin: false,
      successfullyLogin: false,
    },
  },
  'ACCESS GRANTED': {
    description: 'Gain elevated access',
    tasks: {
      attemptLoginAsAdmin: false,
      successfullyLoginAsAdmin: false,
    },
  },
  'Mission Accomplished': {
    description: 'Publicly expose the secret data',
    tasks: {},
  },
} as const);

export type ChallengeTitle = keyof typeof defaultChallenges;
export type ChallengeTasks<T extends ChallengeTitle> = keyof (typeof defaultChallenges)[T]['tasks'];
export type Challenges = {
  [K in ChallengeTitle]: Omit<(typeof defaultChallenges)[K], 'tasks'> & {
    tasks: { [T in ChallengeTasks<K>]: boolean };
  };
};
