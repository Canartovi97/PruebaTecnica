import { z } from 'zod';

export const createRequestSchema = z.object({
  body: z.object({
    clientId: z.string().uuid('clientId debe ser un UUID valido'),
    productName: z.string().min(2, 'El nombre del producto es obligatorio'),
    description: z.string().optional(),
    quantity: z.number().int().positive('La cantidad debe ser un entero positivo'),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export const listRequestsSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z.enum(['OPEN', 'IN_NEGOTIATION', 'CLOSED']).optional(),
    clientId: z.string().uuid().optional(),
  }),
});

export const requestIdParamSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({ id: z.string().uuid('id debe ser un UUID valido') }),
  query: z.object({}).optional(),
});

export type CreateRequestInput = z.infer<typeof createRequestSchema>['body'];
