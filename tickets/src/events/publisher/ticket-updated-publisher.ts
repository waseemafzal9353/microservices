import { Publisher, Subjects, TicketUpdatedEvent } from "@hashbad/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}