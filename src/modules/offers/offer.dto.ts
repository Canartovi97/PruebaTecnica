import { z } from 'zod';

export const createOfferSchema = z.object({
  body: z.object({
    providerId: z.string().uuid('providerId debe ser un UUID valido'),
    price: z.number().positive('El precio debe ser mayor a 0'),
    message: z.string().optional(),
  }),
  params: z.object({ requestId: z.string().uuid('requestId debe ser un UUID valido') }),
  query: z.object({}).optional(),
});

export const listOffersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ requestId: z.string().uuid('requestId debe ser un UUID valido') }),
  query: z.object({}).optional(),
});

export type CreateOfferInput = z.infer<typeof createOfferSchema>['body'];
