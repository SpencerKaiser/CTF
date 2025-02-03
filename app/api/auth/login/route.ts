import { NextRequest } from 'next/server';
import { USERS } from '@/src/utils';
import { markTaskAsComplete } from '@/src/utils/challenges/markTaskAsComplete';
import { encryptCookie } from '@/src/utils/cookies/encryptCookie';
import { cookieKey } from '@/src/utils/cookies/shared';
import { hashPassword } from '@/src/utils/hashPassword';

export const POST = async (req: NextRequest) => {
  try {
    await markTaskAsComplete({ challengeTitle: "We're in...", challengeTask: 'attemptLogin' });

    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(undefined, {
        status: 400,
      });
    }

    const matchingUser = USERS.find((user) => user.username === username);
    const hashedPassword = hashPassword(password);

    if (!matchingUser || matchingUser.passwordHash !== hashedPassword) {
      if (matchingUser?.isAdmin) {
        await markTaskAsComplete({
          challengeTitle: 'ACCESS GRANTED',
          challengeTask: 'attemptLoginAsAdmin',
        });
      }
      const headers: Record<string, string> = matchingUser?.hasTempPassword
        ? { 'X-Temp-Password': 'true' }
        : {};
      return new Response(undefined, {
        headers: headers,
        status: 401,
      });
    }

    await markTaskAsComplete({ challengeTitle: "We're in...", challengeTask: 'successfullyLogin' });
    if (matchingUser.isAdmin) {
      await markTaskAsComplete({
        challengeTitle: 'ACCESS GRANTED',
        challengeTask: 'successfullyLoginAsAdmin',
      });
    }

    const cookieValue = await encryptCookie(matchingUser);

    return new Response(undefined, {
      status: 201,
      headers: {
        'Set-Cookie': `${cookieKey}=${cookieValue}; HttpOnly; Path=/; Max-Age=3600`,
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(undefined, { status: 500 });
  }
};
