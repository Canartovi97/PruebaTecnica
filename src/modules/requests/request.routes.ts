import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { requestController } from './request.controller';
import { createRequestSchema, listRequestsSchema, requestIdParamSchema } from './request.dto';
import offerRoutes from '../offers/offer.routes';

const router = Router();

// POST /api/requests            -> cliente crea una solicitud de producto
router.post('/', validate(createRequestSchema), requestController.create);

// GET /api/requests?status=OPEN -> listar solicitudes (filtrables)
router.get('/', validate(listRequestsSchema), requestController.list);

// GET /api/requests/:id         -> detalle de una solicitud + sus ofertas
router.get('/:id', validate(requestIdParamSchema), requestController.getById);

// Rutas anidadas: /api/requests/:requestId/offers
// Una oferta siempre pertenece a una solicitud, por eso vive anidada aqui.
router.use('/:requestId/offers', offerRoutes);

export default router;
