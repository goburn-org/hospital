import { z } from 'zod';

export const createRoleSchema = z.object({
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional().nullable(),
});

export const updateRoleSchema = createRoleSchema.extend({
  id: z.number(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
