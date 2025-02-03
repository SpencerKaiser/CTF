import { NextRequest } from 'next/server';
import { decryptCookie } from './decryptCookie';
import { cookieKey } from './shared';

/**
 * This method is a workaround that is necessary in lieu of middleware being able to
 * directly modify the request to add properties (like the session)
 */
export const getUserFromRequest = async (req: NextRequest) => {
  const cookieString = req.cookies.get(cookieKey)?.value ?? '';
  return await decryptCookie(cookieString);
};
