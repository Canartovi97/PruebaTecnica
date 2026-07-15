import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { offerController } from './offer.controller';
import { createOfferSchema, listOffersSchema } from './offer.dto';

// mergeParams: necesario para leer :requestId, que viene del router padre.
const router = Router({ mergeParams: true });

// POST /api/requests/:requestId/offers -> proveedor responde con una oferta
router.post('/', validate(createOfferSchema), offerController.create);

// GET  /api/requests/:requestId/offers -> listar ofertas de una solicitud
router.get('/', validate(listOffersSchema), offerController.list);

export default router;
