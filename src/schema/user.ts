import { z } from 'zod';

export const rawUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  passwordHash: z.string(),
  isAdmin: z.boolean(),
});

export type RawUser = z.infer<typeof rawUserSchema>;
export type User = Omit<RawUser, 'passwordHash' | 'isAdmin'> & { isAdmin?: true };
