import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListner } from "../ticket-created-listner"
import { TicketUpdatedEvent } from "@hashbad/common";
import {Message} from 'node-nats-streaming';

const setup = async () => {
    const listner = new TicketCreatedListner(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 30
    });

    await ticket.save(); 

    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'new title',
        price: 343,
        userId: 'kkjhlkhl'
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {msg, ticket, data, listner}
};

it('finds, updates and saves a ticket', async() => {
    const {msg, data, listner, ticket} = await setup();
    await listner.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version)
});

it('acks the ticket', async () => {
    const {msg, data, listner} = await setup();
    await listner.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});

it('does not invoke ack function if the event has skipped version number', async () => {
    const {msg, data, ticket, listner} = await setup();
    data.version = 10;

    try {
        await listner.onMessage(data, msg)
    } catch (error) {
        
    }

    expect(msg.ack).not.toHaveBeenCalled();
})