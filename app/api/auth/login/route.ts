import { NextRequest } from 'next/server';
import { USERS } from '@/src/utils';
import { encryptCookie } from '@/src/utils/cookies/encryptCookie';
import { cookieKey } from '@/src/utils/cookies/shared';
import { hashPassword } from '@/src/utils/hashPassword';

export const POST = async (req: NextRequest) => {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return new Response(undefined, {
        status: 400,
      });
    }

    const matchingUser = USERS.find((user) => user.username === username);
    const hashedPassword = hashPassword(password);

    if (!matchingUser || matchingUser.passwordHash !== hashedPassword) {
      return new Response(undefined, {
        status: 401,
      });
    }

    const cookieValue = encryptCookie(matchingUser);

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
