import { PrismaClient } from '@prisma/client';

// Patron singleton: una sola instancia de PrismaClient para toda la app.
// Evita agotar el pool de conexiones en desarrollo con hot-reload.
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
});

export default prisma;
