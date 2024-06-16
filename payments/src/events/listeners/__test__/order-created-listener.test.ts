import { OrderCreatedEvent, OrderStatus } from "@hashbad/common";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCreatedListener } from "../order-created-listener"
import mongoose from "mongoose";
import {Message} from 'node-nats-streaming';
import { Order } from "../../../models/orders";


const setup = async () => {
    const listener = new OrderCreatedListener(natsWrapper.client);

    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'jhkjhlk',
        userId: 'khkhkk',
        version: 0,
        status: OrderStatus.Created,
        ticket: {
            id: 'ljljl',
            price: 10
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {msg, listener, data}
};


it('replicates the order info', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price)
});

it('acks the message', async () => {
    const {listener, data, msg} = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();

})