import mongoose from "mongoose";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper"
import { ExpirationCompleteListener } from "../expiration-complete-listener"
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@hashbad/common";
import {Message} from 'node-nats-streaming';


const setup = async () => {
    const listener = new ExpirationCompleteListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });

    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'assdasd',
        expiresAt: new Date(),
        ticket
    });

    await order.save();


    const data: ExpirationCompleteEvent['data'] = {
        orderId: order.id
    };

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {ticket, data, listener, msg, order}
};


it('updates the order status to cancelled', async () => {
    const {data, listener, msg, order} = await setup()
    await listener.onMessage(data, msg);
    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
    const {data, listener, msg, order} = await setup()
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(eventData.id).toEqual(order.id)
});

it('acks the message', async () => {
    const {data, listener, msg} = await setup()
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})