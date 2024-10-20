import { z } from 'zod';

export const createRoleSchema = z.object({
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().default('').optional(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof createRoleSchema> & {
  id: string;
};
