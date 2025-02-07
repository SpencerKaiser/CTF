import { NextRequest } from 'next/server';
import z from 'zod';
import { USERS, VULNERABLE_ADMIN_ID } from '@/src/utils';
import { markTaskAsComplete } from '@/src/utils/challenges/markTaskAsComplete';
import { rawUserToUser } from '@/src/utils/rawUserToUser';

const getQueryParamsSchema = z
  .object({
    limit: z.coerce.number().min(0).optional().default(10),
    cursor: z.coerce.number().min(0).optional().default(0),
    expanded: z
      .preprocess((val) => {
        if (typeof val === 'string' && val.toLowerCase() === 'true') return true;
        return false;
      }, z.boolean())
      .optional()
      .default(false),
  })
  .strict();

export const GET = async (req: NextRequest) => {
  await markTaskAsComplete({ challengeTitle: "We're in...", challengeTask: 'findUsersEndpoint' });

  const searchParams = req.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams.entries());
  const { limit: rawLimit, cursor: rawCursor } = query;

  if ([rawLimit, rawCursor].some((val) => val !== undefined)) {
    await markTaskAsComplete({
      challengeTitle: 'ACCESS GRANTED',
      challengeTask: 'findLimitOrPaginate',
    });
  }

  const { data, error } = getQueryParamsSchema.safeParse(query);

  if (error) {
    console.error('Invalid query params', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid query params; only limit, cursor, and expanded are supported',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { limit, cursor, expanded } = data;

  if (expanded) {
    await markTaskAsComplete({
      challengeTitle: "We're in...",
      challengeTask: 'retrieveExpandedUserDetails',
    });
  }

  const nonInclusiveEnd = cursor + limit;

  const users = USERS.slice(cursor, nonInclusiveEnd).map((user) =>
    expanded ? user : rawUserToUser(user)
  );

  if (expanded && users.some(({ id }) => id === VULNERABLE_ADMIN_ID)) {
    await markTaskAsComplete({
      challengeTitle: 'ACCESS GRANTED',
      challengeTask: 'retrieveExpandedVulnerableAdmin',
    });
  }

  const itemsRemain = nonInclusiveEnd < USERS.length;
  const nextCursor = itemsRemain ? nonInclusiveEnd : null; // Null cursor means no items remain

  return Response.json({ users, nextCursor });
};
