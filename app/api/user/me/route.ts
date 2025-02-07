import { NextRequest } from 'next/server';
import { z } from 'zod';
import { markTaskAsComplete } from '@/src/utils/challenges/markTaskAsComplete';
import { getUserFromRequest } from '@/src/utils/cookies/getUserFromRequest';
import { rawUserToUser } from '@/src/utils/rawUserToUser';

const getQueryParamsSchema = z
  .object({
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
  const searchParams = req.nextUrl.searchParams;
  const query = Object.fromEntries(searchParams.entries());

  const { data, error } = getQueryParamsSchema.safeParse(query);
  if (error) {
    console.error('Invalid query params', error);
    return new Response(
      JSON.stringify({ error: 'Invalid query params; only limit and cursor are supported' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { expanded } = data;

  if (expanded) {
    await markTaskAsComplete({
      challengeTitle: "We're in...",
      challengeTask: 'retrieveExpandedUserDetails',
    });
  }

  const user = await getUserFromRequest(req);

  return Response.json(expanded ? user : rawUserToUser(user));
};
