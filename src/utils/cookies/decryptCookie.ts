import crypto from 'crypto';
import { authCookieSchema } from '@/src/schema/auth';
import { RawUser, rawUserSchema } from '@/src/schema/user';
import { algorithm, secretKey } from './shared';

export const decryptCookie = (cookieString: string): RawUser => {
  // Attempt to JSON parse the cookie string into an object that can be further parsed
  let parsedHash = '';
  try {
    parsedHash = JSON.parse(cookieString);
  } catch {
    // Ignore parsing error; let the schema validation handle it
  }

  const { data, error } = authCookieSchema.safeParse(parsedHash);

  if (error) {
    throw new Error('Invalid cookie');
  }

  const { iv, content } = data;
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
  let decryptedUserString = decipher.update(content, 'hex', 'utf8');
  decryptedUserString += decipher.final('utf8');

  let parsedRawUser = '';
  try {
    parsedRawUser = JSON.parse(decryptedUserString);
  } catch {
    // Ignore parsing error; let the schema validation handle it
  }

  const { data: user, error: userParsingError } = rawUserSchema.safeParse(parsedRawUser);

  if (userParsingError) {
    throw new Error('Invalid user data');
  }

  return user;
};
