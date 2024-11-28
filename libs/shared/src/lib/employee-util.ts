import { z } from 'zod';

export const createEmployeeSchema = z.object({
  name: z.string().min(3, 'Atleast 3 characters'),
  email: z.string().min(3, 'Atleast 3 characters'),
  phoneNumber: z
    .string()
    .refine((v) => v.length === 10, {
      message: 'Invalid phone number',
    })
    .refine((v) => /^\d+$/.test(v), {
      message: 'Invalid phone number',
    }),
  department: z.number(),
  password: z
    .object({
      newPassword: z.string().min(8, 'Password must be at least 8 characters'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
    }),
});

export const updateEmployeeSchema = createEmployeeSchema
  .omit({
    password: true,
  })
  .extend({
    id: z.string(),
  });

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
