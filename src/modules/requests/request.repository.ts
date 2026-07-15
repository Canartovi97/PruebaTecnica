import { RequestStatus } from '../../common/enums';
import prisma from '../../config/database';
import { CreateRequestInput } from './request.dto';

export const requestRepository = {
  create(data: CreateRequestInput) {
    return prisma.productRequest.create({
      data: {
        clientId: data.clientId,
        productName: data.productName,
        description: data.description,
        quantity: data.quantity,
      },
    });
  },

  findMany(filters: { status?: RequestStatus; clientId?: string }) {
    return prisma.productRequest.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { offers: true } } },
    });
  },

  findById(id: string) {
    return prisma.productRequest.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, email: true } },
        offers: {
          include: { provider: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
  },

  updateStatus(id: string, status: RequestStatus) {
    return prisma.productRequest.update({ where: { id }, data: { status } });
  },
};
