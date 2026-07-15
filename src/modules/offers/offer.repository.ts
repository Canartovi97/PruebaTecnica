import prisma from '../../config/database';
import { CreateOfferInput } from './offer.dto';

export const offerRepository = {
  create(requestId: string, data: CreateOfferInput) {
    return prisma.offer.create({
      data: {
        requestId,
        providerId: data.providerId,
        price: data.price,
        message: data.message,
      },
    });
  },

  findByRequest(requestId: string) {
    return prisma.offer.findMany({
      where: { requestId },
      include: { provider: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'asc' },
    });
  },
};
