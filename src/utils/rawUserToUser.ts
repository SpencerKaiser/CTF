import { RawUser, User } from '../schema/user';

export const rawUserToUser = (rawUser: RawUser): User => {
  const { isAdmin } = rawUser;
  return {
    id: rawUser.id,
    username: rawUser.username,
    ...(isAdmin ? { isAdmin: true } : {}),
  };
};
