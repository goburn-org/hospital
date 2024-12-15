import { z } from 'zod';

export const roleTypes: [string, ...string[]] = [
  'DOCTOR',
  'NURSE',
  'RECEPTIONIST',
  'ADMIN',
  'ACCOUNTANT',
  'PHARMACIST',
  'LAB_TECHNICIAN',
];

export const createRoleSchema = z.object({
  roleName: z.string().min(3, 'Role name must be at least 3 characters'),
  description: z.string().optional().nullable(),
  roleType: z.enum(roleTypes),
});

export const updateRoleSchema = createRoleSchema.extend({
  id: z.number(),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema> & {
  isSuperAdmin?: boolean;
};
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
