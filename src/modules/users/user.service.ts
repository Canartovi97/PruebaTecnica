import { Role } from '@prisma/client';
import { ApiError } from '../../utils/ApiError';
import { CreateUserInput } from './user.dto';
import { userRepository } from './user.repository';

export const userService = {
  async createUser(input: CreateUserInput) {
    return userRepository.create(input);
  },

  async getAllUsers() {
    return userRepository.findAll();
  },

  /**
   * Usado por los modulos de solicitudes y ofertas para validar
   * que el actor tiene el rol correcto antes de dejarlo operar.
   */
  async assertRole(userId: string, expectedRole: Role) {
    const user = await userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound(`Usuario ${userId} no existe`);
    }
    if (user.role !== expectedRole) {
      throw ApiError.badRequest(
        `El usuario ${userId} tiene rol ${user.role}, se esperaba ${expectedRole}`,
      );
    }
    return user;
  },
};
