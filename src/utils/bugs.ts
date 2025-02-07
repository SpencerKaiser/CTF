import { faker } from '@faker-js/faker';
import seedrandom from 'seedrandom';

const rng = seedrandom('bugs are bad');

faker.seed(123456);

const maxRecursiveDepth = 15; // 2^15 - 1: 32767 total

export type BugVisibility = 'confidential' | 'private' | 'public';
export type Bug = {
  id: string;
  name: string;
  title: string;
  description: string;
  visibility: BugVisibility;
  evolvedFrom?: string;
  style: string;
  styleColor: string;
};

const bugZeroDetails: Pick<Bug, 'name' | 'title' | 'description' | 'style'> = {
  description:
    'Essentially the bug of all bugs. The epitome of zero-day bugs; tremendously valuable to hackers.',
  title: 'The Ultimate Bug',
  name: 'Bug Zero',
  style: 'Origin',
};

const toTitleCase = (text: string) =>
  text
    .split(' ')
    .reduce<string[]>((acc, word) => [...acc, ...word.split('-')], [])
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getVisibilityForDepth = (depth: number): Bug['visibility'] => {
  if (depth === 1) return 'confidential';
  if (depth <= 11) return 'private';
  return 'public';
};

const createBugs = ({
  evolvedFrom,
  depth = 1,
}: {
  evolvedFrom?: string;
  depth?: number;
} = {}): Bug[] => {
  const bug = {
    id: faker.string.uuid(),
    name: toTitleCase(
      `${faker.hacker.adjective()} ${faker.hacker.noun()} ${faker.animal.insect()}`
    ),
    title: faker.company.catchPhrase(),
    description: `${faker.commerce.productDescription()}.`,
    visibility: getVisibilityForDepth(depth),
    evolvedFrom,
    style: faker.word.adjective(),
    styleColor: faker.color.rgb(),
    ...(depth === 1 ? bugZeroDetails : {}),
  };

  const args: Parameters<typeof createBugs>[0] = {
    evolvedFrom: bug.id,
    depth: depth + 1,
  };

  if (depth >= maxRecursiveDepth) {
    return [bug];
  }

  return [bug, ...createBugs(args), ...createBugs(args)];
};

export const BUGS = createBugs().sort(() => rng() - 0.5);
export const BUG_ZERO_ID = (BUGS.find(({ visibility }) => visibility === 'confidential') as Bug).id;
