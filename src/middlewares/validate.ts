import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

/**
 * Middleware generico de validacion. Recibe un schema de Zod y valida
 * body/params/query antes de que la request llegue al controlador.
 * Mantiene los DTOs (schemas) desacoplados de la logica de negocio.
 */
export const validate =
  (schema: AnyZodObject) => (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    req.body = parsed.body ?? req.body;
    next();
  };
