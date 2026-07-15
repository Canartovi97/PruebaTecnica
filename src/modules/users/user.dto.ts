import { z } from 'zod';

// Modulo de usuarios minimo: en este alcance no se implementa autenticacion
// (esa es una opcion aparte de la prueba). Solo se necesita distinguir
// clientes de proveedores para poder crear solicitudes y ofertas.
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email invalido'),
    role: z.enum(['CLIENT', 'PROVIDER']),
  }),
  params: z.object({}).optional(),
  query: z.object({}).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];
