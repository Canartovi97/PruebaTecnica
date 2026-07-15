
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
