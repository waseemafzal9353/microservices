import { Listner, OrderStatus, PaymentCreatedEvent, Subjects } from "@hashbad/common";
import { queueGroupName } from "./queue-group-names";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


export class PaymentCreatedListener extends Listner<PaymentCreatedEvent>{
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = queueGroupName;
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
        const order = await Order.findById(data.ordreId);
        if(!order) throw new Error('Order not found');

        order.set({
            status: OrderStatus.Complete
        });
        await order.save();

        msg.ack()
    }
}