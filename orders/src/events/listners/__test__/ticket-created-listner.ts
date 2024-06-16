import { TicketCreatedEvent } from "@hashbad/common";
import { natsWrapper } from "../../../nats-wrapper"
import { TicketCreatedListner } from "../ticket-created-listner"
import mongoose from "mongoose";
import {Message} from 'node-nats-streaming'
import { Ticket } from "../../../models/ticket";


const setup = async () => {
const listner = new TicketCreatedListner(natsWrapper.client);
const data: TicketCreatedEvent['data'] = {
    
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
}

// @ts-ignore
const msg: Message = {
    ack: jest.fn()
}

return {listner, data, msg}
}

it('creates and saves a ticket', async () => {
    const {listner, data, msg} = await setup();

    await listner.onMessage(data, msg)
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price)
});

it('ack the message', async () => {
    const {data, listner, msg} = await setup();

    await listner.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled()
})