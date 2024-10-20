import { Prisma } from '@prisma/client';
import { z } from 'zod';

export const userLoginSchema = z.object({
  email: z.string().min(4, 'Email/Emp Id is required'),
  password: z.string().min(1, 'Password is required'),
  hospitalId: z.number().default(1),
});

export type UserLoginInput = z.infer<typeof userLoginSchema>;

export type UserWithRolesAndDepartment = Prisma.UserGetPayload<{
  include: {
    Department: true; // Include the Department
    UserRole: true; // Include the UserRole
    Hospital: true; // Include the Hospital
  };
}>;

export type LoginResponse = {
  token: string;
};
