import { RawUser } from '@/src/schema/user';
import { algorithm, secretKey } from './shared';

export const decryptCookie = async (cookieString: string): Promise<RawUser> => {
  let parsedHash: any;
  try {
    parsedHash = JSON.parse(decodeURIComponent(cookieString));
  } catch {
    throw new Error('Invalid cookie format');
  }

  const { iv, content } = parsedHash;

  const key = await crypto.subtle.importKey('raw', secretKey, { name: algorithm }, false, [
    'decrypt',
  ]);

  const decryptedContent = await crypto.subtle.decrypt(
    { name: algorithm, iv: new Uint8Array(iv) },
    key,
    Buffer.from(content, 'base64')
  );

  const userString = new TextDecoder().decode(decryptedContent);
  const user = JSON.parse(userString); // You can validate this against your schema here

  return user as RawUser;
};
