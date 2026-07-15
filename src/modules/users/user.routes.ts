import { Router } from 'express';
import { validate } from '../../middlewares/validate';
import { userController } from './user.controller';
import { createUserSchema } from './user.dto';

const router = Router();

// Helper de prueba: crear/listar clientes y proveedores.
// En un sistema real esto se reemplaza por el modulo de autenticacion (JWT).
router.post('/', validate(createUserSchema), userController.create);
router.get('/', userController.list);

export default router;
