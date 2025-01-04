import { z } from 'zod';

export const createIntentLineItemSchema = z.object({
  productId: z.string(),
  quantity: z.number(),
  supplier: z.string(),
});

export const createIntentSchema = z.array(createIntentLineItemSchema);

export enum IntentStatus {
  Started = 'Started',
  Grn = 'grn',
  Completed = 'Completed',
}

export type CreateIntentRequest = z.infer<typeof createIntentSchema>;
export type CreateIntentLineItemRequest = z.infer<
  typeof createIntentLineItemSchema
>;

export type IntentResponse = {
  id: string;
  createdBy: string;
  createdAt: Date;
  status: IntentStatus;
  json: CreateIntentRequest;
};

export const intentConverter = (
  intent: Omit<IntentResponse, 'status' | 'json'> & {
    status: string;
    json: any;
  },
): IntentResponse => {
  return {
    id: intent.id,
    createdBy: intent.createdBy,
    createdAt: intent.createdAt,
    status: intent.status as IntentStatus,
    json: intent.json,
  };
};
