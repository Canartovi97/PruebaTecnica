import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

/**
 * Middleware centralizado de errores. Toda la aplicacion lanza
 * ApiError o ZodError; este es el unico lugar que sabe traducir
 * eso a una respuesta HTTP consistente.
 */
export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details,
    });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Datos de entrada invalidos',
      details: err.flatten(),
    });
    return;
  }

  console.error('Error no controlado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}
