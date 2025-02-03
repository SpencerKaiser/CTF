import { RawUser } from '@/src/schema/user';
import { algorithm, secretKey } from './shared';

export const encryptCookie = async (user: RawUser): Promise<string> => {
  const userString = JSON.stringify(user);
  const iv = crypto.getRandomValues(new Uint8Array(16)); // Generate a random IV

  const key = await crypto.subtle.importKey('raw', secretKey, { name: algorithm }, false, [
    'encrypt',
  ]);

  const encryptedContent = await crypto.subtle.encrypt(
    { name: algorithm, iv },
    key,
    new TextEncoder().encode(userString)
  );

  const encryptedData = JSON.stringify({
    iv: Array.from(iv),
    content: Buffer.from(encryptedContent).toString('base64'),
  });

  return encodeURIComponent(encryptedData);
};

// This file uses crypto which isn't available in the edge runtime
// Either I can find another crypto package to use or create a middleware that I can invoke within handlers
