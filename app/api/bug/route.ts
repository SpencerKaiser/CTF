import { NextRequest } from 'next/server';
import { z } from 'zod';
import { BUG_ZERO_ID, BUGS, BugVisibility } from '@/src/utils/bugs';
import { markTaskAsComplete } from '@/src/utils/challenges/markTaskAsComplete';
import { getUserFromRequest } from '@/src/utils/cookies/getUserFromRequest';

const getQueryParamsSchema = z
  .object({
    limit: z.coerce.number().min(0).max(500).optional().default(100),
    cursor: z.coerce.number().min(0).optional().default(0),
  })
  .strict();

export const GET = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams.entries());

  const { data, error } = getQueryParamsSchema.safeParse(query);

  if (error) {
    console.error('Invalid query params', error);
    return new Response(
      JSON.stringify({
        error: 'Invalid query params; only limit and cursor are supported',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { limit, cursor } = data;

  const nonInclusiveEnd = cursor + limit;

  let allowedVisibility: BugVisibility = 'public';
  try {
    const { isAdmin } = await getUserFromRequest(req);
    allowedVisibility = isAdmin ? 'confidential' : 'private';
  } catch {
    // No action needed; no session found
  }

  const bugsFilteredByVisibility = BUGS.filter((bug) => {
    if (allowedVisibility === 'confidential') return true;
    if (allowedVisibility === 'private') return bug.visibility !== 'confidential';
    return bug.visibility === 'public';
  });

  const bugs = bugsFilteredByVisibility.slice(cursor, nonInclusiveEnd);

  if (bugs.some(({ id }) => id === BUG_ZERO_ID)) {
    await markTaskAsComplete({
      challengeTitle: 'Save the (digital) world',
      challengeTask: 'retrieveBugZero',
    });
  }

  const itemsRemain = nonInclusiveEnd < BUGS.length;
  const nextCursor = itemsRemain ? nonInclusiveEnd : null; // Null cursor means no items remain

  return Response.json({ bugs: bugs, nextCursor });
};
