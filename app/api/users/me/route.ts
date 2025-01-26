import { RequestWithUser } from '@/src/types/RequestWithUser';

export const GET = (req: RequestWithUser) => {
  return Response.json(req.user);
};
