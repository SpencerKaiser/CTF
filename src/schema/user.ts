import { z } from 'zod';

export const rawUserSchema = z.object({
  id: z.string(),
  username: z.string(),
  lastName: z.string(),
  passwordHash: z.string(),
  isAdmin: z.boolean().optional(),
  hasTempPassword: z.boolean().optional(),
});

export type RawUser = z.infer<typeof rawUserSchema>;
export type User = Omit<RawUser, 'passwordHash' | 'isAdmin' | 'lastName'> & { isAdmin?: true };
