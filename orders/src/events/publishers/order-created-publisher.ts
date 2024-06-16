import { OrderCreatedEvent, Publisher, Subjects } from "@hashbad/common";


export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}