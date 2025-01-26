export const cookieKey = 'session';

export const algorithm = 'aes-256-cbc';

export const secretKey = Buffer.from(
  (process.env.COOKIE_SECRET ?? 'potato').padEnd(32, '0')
).subarray(0, 32);
