import { NextRequest } from 'next/server';
import { RawUser } from '../schema/user';

export type RequestWithUser = NextRequest & {
  user: RawUser;
};
