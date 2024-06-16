import { Listner, Subjects, TicketUpdatedEvent } from "@hashbad/common";
import { queueGroupName } from "./queue-group-names";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/ticket";



export class TicketUpdatedListner extends Listner<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
    queueGroupName = queueGroupName;
    async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
        const {id, title, price} = data;
        // const {id, title, price, version} = data;

        const ticket = await Ticket.findByEvent(data)
        if(!ticket) {
            throw new Error('ticket not found')
        }

        ticket.set({title, price});
        // ticket.set({title, price, version});
        await ticket.save();

        msg.ack()
    }
}