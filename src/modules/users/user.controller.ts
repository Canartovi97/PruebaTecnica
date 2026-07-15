import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { userService } from './user.service';

export const userController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  }),

  list: catchAsync(async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  }),
};
