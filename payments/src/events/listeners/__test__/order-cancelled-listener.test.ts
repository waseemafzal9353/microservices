import mongoose from "mongoose";
import { Order } from "../../../models/orders";
import { natsWrapper } from "../../../nats-wrapper"
import { OrderCancelledListener } from "../order-cancelled-listener"
import { OrderCancelledEvent, OrderStatus } from "@hashbad/common";
import {Message} from 'node-nats-streaming'


const setup = async () => {
    const listener = new OrderCancelledListener(natsWrapper.client);
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        price: 20,
        status: OrderStatus.Cancelled,
        userId: 'klhhll',
        version: 0
    });

    await order.save();

    const data: OrderCancelledEvent['data'] = {
        id: order.id,
        version: order.version,
        ticket: {
            id: 'kjljhl'
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {data, listener, msg, order}
};

it('updates the order status', async () => {
    const {data, listener, msg, order} = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
});

it('acks the message', async () => {
    const {data, listener, msg, order} = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
})