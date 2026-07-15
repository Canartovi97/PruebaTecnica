import { RequestStatus, Role } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { userService } from '../users/user.service';
import { CreateRequestInput } from './request.dto';
import { requestRepository } from './request.repository';

export const requestService = {
  async createRequest(input: CreateRequestInput) {
    // Regla de negocio: solo un usuario con rol CLIENT puede crear solicitudes.
    await userService.assertRole(input.clientId, Role.CLIENT);
    return requestRepository.create(input);
  },

  async listRequests(filters: { status?: RequestStatus; clientId?: string }) {
    return requestRepository.findMany(filters);
  },

  async getRequestById(id: string) {
    const request = await requestRepository.findById(id);
    if (!request) {
      throw ApiError.notFound(`Solicitud ${id} no encontrada`);
    }
    return request;
  },

  /**
   * Usado por el modulo de ofertas: una solicitud CLOSED ya no debe
   * aceptar nuevas ofertas.
   */
  async assertIsOpenForOffers(id: string) {
    const request = await this.getRequestById(id);
    if (request.status === RequestStatus.CLOSED) {
      throw ApiError.conflict(`La solicitud ${id} esta cerrada y no admite nuevas ofertas`);
    }
    return request;
  },

  async markInNegotiation(id: string) {
    return requestRepository.updateStatus(id, RequestStatus.IN_NEGOTIATION);
  },
};
