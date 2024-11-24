import { z } from 'zod';

export const hospitalCreateInputSchema = z.object({
  hospitalName: z.string(),
  phoneNumber: z.string(),
  hospitalImg: z.string(),
});
