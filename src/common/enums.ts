/**
 * SQLite no soporta el tipo `enum` nativo de Prisma, asi que los campos
 * `role` y `status` se modelan como String en prisma/schema.prisma.
 * Este archivo es la unica fuente de verdad de los valores validos en el
 * lado de TypeScript; los DTOs (Zod) deben mantenerse alineados con estas
 * listas. Si se migra a PostgreSQL, estos mismos valores se pueden mover
 * a `enum` real en el schema sin tocar el codigo de aplicacion.
 */

export const Role = {
  CLIENT: 'CLIENT',
  PROVIDER: 'PROVIDER',
} as const;
export type Role = (typeof Role)[keyof typeof Role];

export const RequestStatus = {
  OPEN: 'OPEN', // aceptando ofertas
  IN_NEGOTIATION: 'IN_NEGOTIATION', // tiene al menos una oferta
  CLOSED: 'CLOSED', // el cliente cerro la solicitud
} as const;
export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const OfferStatus = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  COUNTERED: 'COUNTERED',
} as const;
export type OfferStatus = (typeof OfferStatus)[keyof typeof OfferStatus];
