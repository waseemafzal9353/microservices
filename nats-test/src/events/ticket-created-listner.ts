import { Message } from "node-nats-streaming";
import { Listner } from "./base-listner";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListner extends Listner<TicketCreatedEvent>{
    
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payment-service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message): void {
        console.log('Event data!', data);

        msg.ack();
    }

}