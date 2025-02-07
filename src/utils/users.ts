import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';
import { RawUser } from '../schema/user';
import { hashPassword } from './hashPassword';

faker.seed(123456);
const rng = seedrandom('seed');

export const tempPasswordSuffix = '1234';

const numUsers = 500;

// Given the nature of random numbers and that we only one one admin to have a temp number,
// there is no guarantee we'll hit the numbers below hence "target"
const targetNumAdmins = 10;
const targetNumUsersWithTempPasswords = 10;

const deDupe = (arr: number[]) => Array.from(new Set(arr));

const getRandomIndices = ({
  numIndices,
  forceInclude,
}: {
  numIndices: number;
  forceInclude?: number;
}) =>
  deDupe([
    ...(forceInclude !== undefined ? [forceInclude] : []), // Add the forced number to the front so it's included in the slice
    ...new Array(numIndices * 2) // Double up to help get us to the target after dupes
      .fill(null)
      .map(() => Math.floor(rng() * numUsers)), // Force at least 7 as an index, otherwise rand
  ])
    .slice(0, numIndices) // Slice to the target number after de-duplication
    .sort((a, b) => a - b);

const adminIndices = getRandomIndices({ numIndices: targetNumAdmins, forceInclude: 12 }); // Make sure one admin is in the top 10 to aid in discovery
const resetPasswordIndices = deDupe([
  ...getRandomIndices({ numIndices: targetNumUsersWithTempPasswords * 2, forceInclude: 7 }) // Make extra to compensate for potential overlap with admins
    .filter((index) => !adminIndices.includes(index)), // Remove admin dupes
]).slice(0, targetNumUsersWithTempPasswords); // Potentially reduce back to target number
const indexOfVulnerableAdmin = adminIndices[Math.floor(adminIndices.length / 2)] as number;

/**
 * Generate a list of users using a seed so the result is static across runs
 * @returns {RawUser[]} list of users
 */
const createUsers = (): Readonly<RawUser[]> => {
  const users: RawUser[] = [];

  for (let i = 0; i < numUsers; i++) {
    const recoveryWord = faker.word.sample();
    const isAdmin = adminIndices.includes(i) || undefined; // Use undefined so it's not always visible in the API response

    // If index of the current user is the "vulnerable admin", make their password the temp password, else follow normal flow
    const hasTempPassword =
      i === indexOfVulnerableAdmin || resetPasswordIndices.includes(i) || undefined; // Use undefined so it's not always visible in the API response

    const password = hasTempPassword
      ? `${recoveryWord}${tempPasswordSuffix}`
      : faker.internet.password();

    users.push({
      id: faker.string.uuid(),
      isAdmin,
      recoveryWord,
      hasTempPassword,
      username: faker.internet.username(),
      passwordHash: hashPassword(password),
    });
  }
  return users;
};

/**
 * List of statically generated users that can be referenced at any time
 */
export const USERS = createUsers();
export const VULNERABLE_ADMIN_ID = (USERS[indexOfVulnerableAdmin] as RawUser).id;
