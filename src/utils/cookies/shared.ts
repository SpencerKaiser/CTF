export const cookieKey = 'session';

export const algorithm = 'AES-CBC';

export const secretKey = new TextEncoder().encode(
  (process.env.COOKIE_SECRET ?? 'potato').padEnd(32, '0').slice(0, 32)
);
