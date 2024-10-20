import { z } from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  roleId: z.number(),
});

export const updateDepartmentSchema = createDepartmentSchema.extend({
  id: z.number(),
});

export type CreateDepartmentInput = z.infer<typeof createDepartmentSchema>;
export type UpdateDepartmentInput = z.infer<typeof updateDepartmentSchema>;
