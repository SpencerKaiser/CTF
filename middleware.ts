import { NextRequest } from 'next/server';
import { RequestWithUser } from './src/types/RequestWithUser';
import { decryptCookie } from './src/utils/cookies/decryptCookie';
import { cookieKey } from './src/utils/cookies/shared';

const ignoredBasePaths = ['/api/auth'];
const ignoredFullPaths = ['/api/users'];

export const middleware = (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/api')) {
    // Ignore session validation for non-API routes
    console.debug('Ignoring non-api path...');
    return;
  }

  console.log(pathname);

  if (
    ignoredBasePaths.some((path) => pathname.startsWith(path)) ||
    ignoredFullPaths.includes(pathname)
  ) {
    console.debug('Ignoring api path...', pathname);
    // Ignore session validation for auth routes and non-API routes
    return;
  }

  try {
    const cookieString = req.cookies.get(cookieKey)?.value;

    if (!cookieString) {
      return new Response(undefined, {
        status: 401,
      });
    }

    const user = decryptCookie(cookieString);
    (req as RequestWithUser).user = user;
  } catch (error) {
    console.error(error);
    return new Response(undefined, {
      status: 500,
    });
  }
};
