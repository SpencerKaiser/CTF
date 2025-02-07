import { NextRequest } from 'next/server';
import { z } from 'zod';
import { BUG_ZERO_ID, BUGS, BugVisibility } from '@/src/utils/bugs';
import { markTaskAsComplete } from '@/src/utils/challenges/markTaskAsComplete';
import { getUserFromRequest } from '@/src/utils/cookies/getUserFromRequest';

const visibilityValues: [BugVisibility, ...BugVisibility[]] = ['confidential', 'private', 'public'];

const patchQueryParamsSchema = z
  .object({
    bugId: z.string().uuid(),
    visibility: z.enum(visibilityValues),
  })
  .strict();

export const PATCH = async (
  req: NextRequest,
  { params }: { params: Promise<{ bugId: string }> }
) => {
  await markTaskAsComplete({
    challengeTitle: 'Save the (digital) world',
    challengeTask: 'identifyPatchEndpoint',
  });

  const user = await getUserFromRequest(req);
  if (!user.isAdmin) {
    return new Response(undefined, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const { bugId: rawBugId } = await params;

  const { data, error } = patchQueryParamsSchema.safeParse({ ...body, bugId: rawBugId });
  if (error) {
    return new Response(undefined, { status: 400 });
  }

  const matchingBug = BUGS.find((bug) => bug.id === data.bugId);

  if (!matchingBug) {
    return new Response(undefined, { status: 404 });
  }

  // Update the original data structure
  matchingBug.visibility = data.visibility;

  if (matchingBug.id === BUG_ZERO_ID) {
    await markTaskAsComplete({
      challengeTitle: 'Save the (digital) world',
      challengeTask: 'patchBugZero',
    });
  }

  return Response.json(matchingBug);
};
