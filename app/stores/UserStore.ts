import axios, { isAxiosError } from 'axios';
import { create } from 'zustand';
import { User } from '@/src/schema/user';

export type UserFetchError = {
  error: 'unauthorized' | 'server-error';
};

const fetchUser = async (): Promise<User | UserFetchError> => {
  try {
    const { data } = await axios.get<User>('/api/user/me?expanded=false');
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.status === 401) {
      return { error: 'unauthorized' };
    }
  }
  return { error: 'server-error' };
};

type UserStore = {
  user: User | undefined;
  init: () => Promise<UserFetchError | undefined>;
  reset: () => void;
  isLoading: boolean;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUserStore = create<UserStore>((set) => ({
  isLoading: true,
  user: undefined,
  setUser: (user: User) => set({ user }),
  init: async () => {
    const [result] = await Promise.all([fetchUser(), sleep(750)]);
    if ('username' in result) {
      set({ user: result, isLoading: false });
    } else {
      set({ isLoading: false });
      return result;
    }
  },
  reset: () => {
    set({ user: undefined });
  },
}));

// type PrivateUserStore = {
//   user: User | undefined;
//   setUser: (user: User) => void;
// };

// export type UserFetchError = {
//   error: 'unauthorized' | 'server-error';
// };

// export class UserStore {
//   private static useUserStore = create<PrivateUserStore>((set) => ({
//     user: undefined,
//     setUser: (user) => set({ user }),
//   }));

//   private static async fetchUser(): Promise<User | UserFetchError> {
//     try {
//       const { data } = await axios.get<User>('/api/users/me');
//       return data;
//     } catch (error) {
//       if (isAxiosError(error) && error.status === 401) {
//         return { error: 'unauthorized' };
//       }
//     }
//     return { error: 'server-error' };
//   }

//   public static async init(): Promise<User | UserFetchError> {
//     const result = await this.fetchUser();

//     if ('username' in result) {
//       UserStore.useUserStore().setUser(result);
//     }

//     return result;
//   }

//   public static get user() {
//     return UserStore.useUserStore.getState().user;
//   }
// }
