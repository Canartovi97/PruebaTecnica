import { Role } from '@prisma/client';
import { requestService } from '../requests/request.service';
import { userService } from '../users/user.service';
import { CreateOfferInput } from './offer.dto';
import { offerRepository } from './offer.repository';

export const offerService = {
  async createOffer(requestId: string, input: CreateOfferInput) {
    // Reglas de negocio orquestadas aqui, no en el controlador:
    // 1) la solicitud debe existir y estar abierta a ofertas
    // 2) quien oferta debe tener rol PROVIDER
    await requestService.assertIsOpenForOffers(requestId);
    await userService.assertRole(input.providerId, Role.PROVIDER);

    const offer = await offerRepository.create(requestId, input);

    // Una solicitud con al menos una oferta pasa a "en negociacion".
    await requestService.markInNegotiation(requestId);

    return offer;
  },

  async listOffersByRequest(requestId: string) {
    // Reutiliza la validacion de existencia de la solicitud.
    await requestService.getRequestById(requestId);
    return offerRepository.findByRequest(requestId);
  },
};
