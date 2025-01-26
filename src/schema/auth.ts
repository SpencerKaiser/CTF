import { z } from 'zod';

export const authCookieSchema = z.object({
  iv: z.string().min(0),
  content: z.string(), // stringified raw user
});

export type Hash = z.infer<typeof authCookieSchema>;
