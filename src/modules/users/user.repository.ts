import { Role } from '@prisma/client';
import prisma from '../../config/database';
import { CreateUserInput } from './user.dto';

/**
 * Repositorio: unico punto que conoce a Prisma para este dominio.
 * Si manana se cambia el ORM o se agrega cache, solo se toca este archivo.
 */
export const userRepository = {
  create(data: CreateUserInput) {
    return prisma.user.create({ data: { ...data, role: data.role as Role } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  findByRole(role: Role) {
    return prisma.user.findMany({ where: { role } });
  },

  findAll() {
    return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
  },
};
