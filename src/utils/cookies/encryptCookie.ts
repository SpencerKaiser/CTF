import crypto from 'crypto';
import { RawUser } from '@/src/schema/user';
import { algorithm, secretKey } from './shared';

const iv = crypto.randomBytes(16);

export const encryptCookie = (user: RawUser): string => {
  const userString = JSON.stringify(user);

  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(userString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return JSON.stringify({
    iv: iv.toString('hex'),
    content: encrypted,
  });
};
