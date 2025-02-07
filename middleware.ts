import { NextRequest } from 'next/server';
import { getUserFromRequest } from './src/utils/cookies/getUserFromRequest';

const ignoredBasePaths = ['/api/auth', '/api/ctf'];
const ignoredFullPaths = ['/api/users', '/api/digimal'];

export const middleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith('/api')) {
    // Ignore session validation for non-API routes
    console.debug('Ignoring non-api path...');
    return;
  }

  if (
    ignoredBasePaths.some((path) => pathname.startsWith(path)) ||
    ignoredFullPaths.includes(pathname)
  ) {
    console.debug('Ignoring api path...', pathname);
    // Ignore session validation for auth routes and non-API routes
    return;
  }

  try {
    try {
      await getUserFromRequest(req);
    } catch {
      return new Response(undefined, {
        status: 401,
      });
    }

    // Continue; valid session
  } catch (error) {
    console.error(error);
    return new Response(undefined, {
      status: 500,
    });
  }
};
