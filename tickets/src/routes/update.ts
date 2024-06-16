import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth, validateRequest } from '@hashbad/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../models/tickets';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publisher/ticket-updated-publisher';
import { natsWrapper } from '../nats-wrapper';
import { version } from 'mongoose';

const router = express.Router();

router.put('/api/tickets/:id', 
requireAuth, 
[body('title').not().isEmpty().withMessage('title must be provided'),
    body('price').isFloat({gt: 0}).withMessage('price must be provided and must be a positive number')
], validateRequest,
async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
        throw new NotFoundError()
    }

    if(ticket.orderId) throw new BadRequestError('cannot edit a reserved ticket!')
    if(ticket.userId !== req.currentUser!.id){
        throw new NotAuthorizedError()
    }

    ticket.set({
        title: req.body.title,
        price: req.body.price
    });
    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version
    })
    res.send(ticket)
});

export {router as updateTicketRouter}