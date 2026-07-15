import { Request as ExpressRequest, Response } from 'express';
import { RequestStatus } from '@prisma/client';
import { catchAsync } from '../../utils/catchAsync';
import { requestService } from './request.service';

export const requestController = {
  create: catchAsync(async (req: ExpressRequest, res: Response) => {
    const request = await requestService.createRequest(req.body);
    res.status(201).json(request);
  }),

  list: catchAsync(async (req: ExpressRequest, res: Response) => {
    const { status, clientId } = req.query as { status?: RequestStatus; clientId?: string };
    const requests = await requestService.listRequests({ status, clientId });
    res.status(200).json(requests);
  }),

  getById: catchAsync(async (req: ExpressRequest, res: Response) => {
    const request = await requestService.getRequestById(req.params.id);
    res.status(200).json(request);
  }),
};
