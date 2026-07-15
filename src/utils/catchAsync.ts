import { NextFunction, Request, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

/**
 * Envuelve un controlador async y reenvia cualquier excepcion a next(),
 * para que caiga en el middleware centralizado de manejo de errores.
 */
export const catchAsync = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
