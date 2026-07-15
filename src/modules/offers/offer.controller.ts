import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { offerService } from './offer.service';

export const offerController = {
  create: catchAsync(async (req: Request, res: Response) => {
    const offer = await offerService.createOffer(req.params.requestId, req.body);
    res.status(201).json(offer);
  }),

  list: catchAsync(async (req: Request, res: Response) => {
    const offers = await offerService.listOffersByRequest(req.params.requestId);
    res.status(200).json(offers);
  }),
};
