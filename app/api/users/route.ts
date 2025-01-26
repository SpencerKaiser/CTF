import { NextRequest } from 'next/server';
import z from 'zod';
import { USERS } from '@/src/utils';
import { rawUserToUser } from '@/src/utils/rawUserToUser';

const getQueryParamsSchema = z
  .object({
    limit: z.coerce.number().min(0).optional().default(10),
    cursor: z.coerce.number().min(0).optional().default(0),
  })
  .strict();

export const GET = (req: NextRequest) => {
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

  const { limit, cursor } = data;
  console.log(limit, cursor, searchParams, query);

  const users = USERS.slice(cursor, cursor + limit).map((user) => rawUserToUser(user));

  const nextCursor = cursor + limit;

  return Response.json({ users, nextCursor });
};
