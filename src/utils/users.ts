import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { RawUser } from '../schema/user';
import { hashPassword } from './hashPassword';

faker.seed(123456);

const numUsersToMake = 400;
const numAdmins = 10;
const rng = seedrandom('seed');
const adminIndexes = new Array(numAdmins)
  .fill(null)
  .map(() => Math.floor(rng() * numUsersToMake))
  .sort((a, b) => a - b);

console.log('Admin indexes: ', adminIndexes);

const createUsers = () => {
  const users: RawUser[] = [];

  for (let i = 0; i < numUsersToMake; i++) {
    const isAdmin = adminIndexes.includes(i);
    users.push({
      id: faker.string.uuid(),
      isAdmin,
      username: faker.internet.username(),
      passwordHash: hashPassword(isAdmin ? 'password' : faker.internet.password()),
    });
  }
  return users;
};

export const USERS = createUsers();
