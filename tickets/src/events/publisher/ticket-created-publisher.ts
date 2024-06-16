import { Publisher, Subjects, TicketCreatedEvent } from "@hashbad/common";


export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}